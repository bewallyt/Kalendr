from django.shortcuts import render
from rest_framework import viewsets
from datetime import datetime
from rest_framework.response import Response
from rest_framework import status
from posts.serializers import PostSerializer
from authentication.models import Account
from posts.models import Post
from pre_signup.models import PrefSignUp, PrefSignUpSlot, PrefTimeBlock, SignUpPreference
from pre_signup.serializers import PrefSignUpSheetSerializer


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
        a pref-based signup sheet:
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
            serializer = PrefSignUpSheetSerializer(post.prefsignup,
                                                   context={'is_owner': False,
                                                            'requester': requester.username})
        else:
            print 'Pre-based signup: requester is the post owner'
            serializer = PrefSignUpSheetSerializer(post.prefsignup,
                                                   context={'is_owner': True,
                                                            'requester': post_owner.username})

        print 'in pre_signup view list:'
        print serializer.data
        return Response(serializer.data,status=status.HTTP_200_OK)


class RequesterSignUpView(viewsets.ModelViewSet):
    serializer_class = PrefSignUpSheetSerializer
    queryset = PrefSignUp.objects.all()


    '''
        When a requester opens the detail view of a pref-based signup
        and click the "SIGNUP" button, this function is triggered to return
        a list of signup slots. For pref-based signup, the list consists of
        all the signup slots.
    '''
    def list(self, request, post_pk, *args, **kwargs):
        post = Post.objects.get(pk = post_pk)
        requester = Account.objects.get(email=request.user.email)
        pref_signup_sheet = post.prefsignup

        serializer = PrefSignUpSheetSerializer(pref_signup_sheet,
                                      context = {'is_owner': False,
                                                 'requester': requester.username})

        print 'in RequesterSignUpView list function'

        print serializer.data

        return Response(serializer.data)


    '''
        This function is called when a requester selects a list of slots, each
        of which has a preference associated.

        Implementation of this function follow the same logic as the create
        function in signu/views.py.
        Therefore, the expected input is
            1. A list of start_time
            2. A list of end_time
            3. A list of preferences
            4. postPk
    '''
    def create(self, request, *args, **kwargs):
        def unicode_to_datetime(code):
            datetime_obj = datetime.strptime(code, '%Y-%m-%dT%H:%M:%SZ')
            return datetime_obj

        requester = Account.objects.get(email=request.user.email)
        post = Post.objects.get(pk = request.data['postPk'])

        pref_slot_queryset = PrefSignUpSlot.objects.filter(block__sheet__post = post)

        # What's the best way of deleting a many-to-many field element?
        # delete the through field element?
        # How to apply multiple filters on a queryset
        pref_link_list = SignUpPreference.objects.filter(slot__block__sheet__post = post
                                                ).filter(requester=requester)
        pref_link_list.delete()



        # Update/create signup links
        begin_time_list_unicode = request.data['beginDateTimes']
        end_time_list_unicode = request.data['endDateTimes']
        preference_list = request.data['preference']
        begin_time_list_datetime = list(map(unicode_to_datetime, begin_time_list_unicode))
        end_time_list_datetime = list(map(unicode_to_datetime, end_time_list_unicode))

        for i in range(0, len(begin_time_list_datetime)):
            slot = pref_slot_queryset.get(start_time = begin_time_list_datetime[i])
            pref = 3
            if preference_list[i] == "notPref":
                pref = 1
            elif preference_list[i] == "slightlyPref":
                pref = 2
            else:
                pref = 3
            pref_link = SignUpPreference(slot = slot, requester = requester, pref = pref)
            pref_link.save()









