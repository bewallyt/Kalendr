from rest_framework import viewsets
from rest_framework.response import Response
from signup.models import SignUp, TimeBlock, SignUpSlot
from datetime import datetime, time, date, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from signup.serializers import SignUpSheetSerializer
from posts.serializers import PostSerializer
from authentication.models import Account
from posts.models import Post
from combine_slots import combine

# Create your views here.
class SignUpCreateAndListView(viewsets.ModelViewSet):
    serializer_class = SignUpSheetSerializer
    queryset = SignUp.objects.all()

    '''
        Expect data format:
            name: name
            max_duration: max_duration (int)
            min_duration: min_duration (int)
            max_slots: max_slots(int)
            begin_time_list: 'a list
            end_time_list: 'a list

    '''
    # I have seen: datetime.datetime.strptime(u'2014-03-06T04:38:51Z', '%Y-%m-%dT%H:%M:%SZ')
    # datetime.strptime(date_posted, '%Y-%m-%dT%H:%M:%S.%SZ')
    #u'2015-03-22T18:00:00.000Z'


    def create(self, request):
        def unicode_to_datetime(code):
            datetime_obj = datetime.strptime(code, '%Y-%m-%dT%H:%M:%S.%fZ')
            return datetime_obj

        owner = Account.objects.get(email = request.user.email)
        name = request.data['content']
        week_num = request.data['weekNum']
        day_of_week = request.data['dayOfWeek']
        loc = request.data['location']

        max_slot = request.data['numSlotsPerUser']
        min_duration = request.data['minTimes']['undefined']
        max_duration = request.data['maxTimes']['undefined']

        begin_time_list_unicode = request.data['beginDateTimes']
        end_time_list_unicode = request.data['endDateTimes']
        begin_time_list_datetime = list(map(unicode_to_datetime, begin_time_list_unicode))
        end_time_list_datetime = list(map(unicode_to_datetime, end_time_list_unicode))

        post = Post.objects.create(author = owner, content= "SignUp: " + name, description_event = "Sign up sheet",
                                   week_num = week_num, day_of_week = day_of_week,
                                   location_event = loc, start_time = begin_time_list_datetime[0],
                                   need_repeat = False, is_date_set = False, is_week_set = True)
        post.save()

        SignUp.objects.create_signup(post, name, loc, max_duration, min_duration,
                                     max_slot, begin_time_list_datetime, end_time_list_datetime)

        post_data = PostSerializer(post).data

        return Response(post_data, status=status.HTTP_201_CREATED)

    '''
        This API is called when user click on the description
        button on a post card.
        If the post card is a regular post, this function uses PostSerializer.
        If the post card is a signup object, this function uses SignUpSheetSerializer.

        When the JSON string is created, the function adds a type key into the JSON.
        So when the front end gets the JSON, the front end can check the data.data['type']
        if the result is 'post' then it's a regular post. If the reuslt is 'signup', then
        it's a signup.

        And again, the parameter has to have name post_pk, otherwise: runtime error:
            list() got an unexpected keyword argument 'post_pk'
    '''
    def list(self, request, post_pk):
        post = Post.objects.get(pk = post_pk)
        post_owner = post.author
        requester = Account.objects.get(email=request.user.email)

        if hasattr(post, 'signup'):
            print 'Post is a signup sheet'

            if requester != post_owner:
                print 'requester is NOT post owner'
                #TODO:

                serializer = SignUpSheetSerializer(post.signup, context={'is_owner': False})

            else:
                print 'requester is post owner'
                serializer = SignUpSheetSerializer(post.signup, context={'is_owner': True})

        else:
            print 'Post is not a signup sheet'
            serializer = PostSerializer(post)

        #Now that I have a JSON, how do I inject a field into this JSON?
        print serializer.data
        return Response(serializer.data)

class SignUpView(viewsets.ModelViewSet):
    serializer_class = SignUpSheetSerializer
    queryset = SignUp.objects.all()

    def list(self, request, post_pk, duration_pk, *args, **kwargs):
        post = Post.objects.get(pk = post_pk)
        post_owner = post.author

        signup_sheet = post.signup
        min_duration = signup_sheet.min_duration
        num_slots_to_combine = duration_pk/min_duration
        print num_slots_to_combine

        if num_slots_to_combine != 1:
            data = combine(post, post.signup, num_slots_to_combine)
            print data
            return Response(data)
        else:
            serializer = SignUpSheetSerializer(post.signup, context={'is_owner': False})

        print serializer.data

        return Response(serializer.data)
