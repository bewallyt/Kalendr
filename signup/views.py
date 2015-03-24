from rest_framework import viewsets
from rest_framework.response import Response
from signup.models import SignUp, TimeBlock, SignUpSlot
from datetime import datetime, time, date, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from signup.serializers import SignUpSheetSerializer
from authentication.models import Account
from posts.models import Post


# Create your views here.
class SignUpCreateView(viewsets.ModelViewSet):
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
        print owner.email


        print 'In Signup Create'
        print request.data
        name = request.data['content']

        post = Post.objects.create(author = owner, content= "SignUp: " + name)
        print post.content
        post.save()

        max_slot = request.data['numSlotsPerUser']
        min_duration = request.data['minTimes']['undefined']
        max_duration = request.data['maxTimes']['undefined']
        loc = request.data['location']

        begin_time_list_unicode = request.data['beginDateTimes']
        end_time_list_unicode = request.data['endDateTimes']
        begin_time_list_datetime = list(map(unicode_to_datetime, begin_time_list_unicode))
        end_time_list_datetime = list(map(unicode_to_datetime, end_time_list_unicode))
        '''
        print begin_time_list_datetime
        print begin_time_list_datetime[0]

        print type(post)
        print type(name)
        print type(loc)
        print type(max_duration)
        print type(min_duration)
        print type(max_slot)
        print begin_time_list_datetime
        print end_time_list_datetime
        '''
        SignUp.objects.create_signup(post,
                                     name,
                                     loc,
                                     max_duration,
                                     min_duration,
                                     max_slot,
                                     begin_time_list_datetime,
                                     end_time_list_datetime)





        return Response(request.data, status=status.HTTP_200_OK)


