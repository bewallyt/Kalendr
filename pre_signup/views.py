from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from datetime import datetime, time, date, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from posts.serializers import PostSerializer
from authentication.models import Account
from posts.models import Post
from pre_signup.models import PrefSignUp, PrefSignUpSlot, PrefTimeBlock
from pre_signup.serializers import PrefSignUpSheetSerializer, PrefSignUpSlotSerializer, PrefTimeBlockSerializer


class PrefSignUpCreatAndListView(viewsets.ModelViewSet):
    serializer_class = PrefSignUpSheetSerializer
    queryset = PrefSignUp.objects.all()


    '''
        Originator calls this func when creating a pref-based signup
        Originator fills in the form and then pass info in that form
        to this function.

        Expected Data Format:
            Name: name
            duration: duration (There is only one duration instead of max and min)
            begin_time_list : for timeblocks
            end_time_list : for timeblocks
    '''
    def create(self, request, *args, **kwargs):
        def unicode_to_datetime(code):
            datetime_obj = datetime.strptime(code, '%Y-%m-%dT%H:%M:%S.%fZ')
            return datetime_obj

        owner = Account.objects.get(email = request.user.email)
        name = request.data['content']
        week_num = request.data['weekNum']
        day_of_week = request.data['dayOfWeek']
        loc = request.data['location']

        duration = request.data['duration']#['undefined']


        begin_time_list_unicode = request.data['beginDateTimes']
        end_time_list_unicode = request.data['endDateTimes']
        begin_time_list_datetime = list(map(unicode_to_datetime, begin_time_list_unicode))
        end_time_list_datetime = list(map(unicode_to_datetime, end_time_list_unicode))

        post = Post.objects.create(author = owner, content= "SignUp: " + name, description_event = "Sign up sheet",
                                   week_num = week_num, day_of_week = day_of_week,
                                   location_event = loc, start_time = begin_time_list_datetime[0],
                                   need_repeat = False, is_date_set = False, is_week_set = True)
        post.save()

        PrefSignUp.objects.create_signup(post, name, loc, duration,
                                        begin_time_list_datetime,
                                        end_time_list_datetime)
        post_data = PostSerializer(post).data

        return Response(post_data,
                        status = status.HTTP_201_CREATED)

    '''
        Originator calls this to check the detailed information of
        a pref-based signup sheet
        duration
        timeblocks
        list of users shared with
        users who haven't replied

        Here the implementation is a little bit awkward. It is assigned to the
        list funciton in signup/views.py to handle the click on a post details
        button. But structurally, responding to clicks on a post details button
        should be handled by a function in post/views.py.

        Also, it would be ideal if we can implement this function and call this
        function in the list funciton in signup/views.py.
    '''
    def list(self, request, post_pk):
        post = Post.objects.get(pk = post_pk)
        post_owner = post.author
        requester = Account.objects.get(email=request.user.email)

        '''
            If the requester is post owner, then the requester should be able
            to see who has "signed up" for which slots.

        '''
        if requester != post_owner:
            print 'Pre-based signup: requester is NOT the post owner'
        else:
            print 'Pre-based signup: requester is the post owner'




