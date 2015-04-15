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
        print "create pref_based sign up"
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

        post = Post.objects.create(author = owner, content= "Pref-Based SignUp: " + name, description_event = "Sign up sheet",
                                   week_num = week_num, day_of_week = day_of_week,
                                   location_event = loc, start_time = begin_time_list_datetime[0],
                                   need_repeat = False, is_date_set = False, is_week_set = True)
        post.save()

        print "post saved and about to create signup"
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
        This function is called when a requester signs up a list of slots, each
        of which has a preference associated. The M2M field in PrefSignUpSlot
        will add more Accounts after this method

        Implementation of this function follow the same logic as the create
        function in signup/views.py.
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

        if post.prefsignup.resolved:
            print 'Signup Already Resolved'
            return Response(status=status.HTTP_400_BAD_REQUEST)

        pref_slot_queryset = PrefSignUpSlot.objects.filter(block__sheet__post = post).order_by('start_time')

        # What's the best way of deleting a many-to-many field element?
        # delete the through field element?
        # How to apply multiple filters on a queryset
        pref_link_list = SignUpPreference.objects.filter(slot__block__sheet__post = post
                                                ).filter(requester=requester)
        pref_link_list.delete()



        # Update/create signup links
        #begin_time_list_unicode = request.data['beginDateTimes']
        #end_time_list_unicode = request.data['endDateTimes']
        preference_list = request.data['preference']
        #print begin_time_list_unicode
        #print end_time_list_unicode
        print preference_list
        #begin_time_list_datetime = list(map(unicode_to_datetime, begin_time_list_unicode))
        #end_time_list_datetime = list(map(unicode_to_datetime, end_time_list_unicode))

        for i in range(0, len(pref_slot_queryset)):
            slot = pref_slot_queryset[i]
            pref = 3
            if preference_list[i] == "notPref":
                pref = 1
            elif preference_list[i] == "slightlyPref":
                pref = 2
            elif preference_list[i] == 'am':
                pref = 0
            else:
                pref = 3
            if pref > 0:
                pref_link = SignUpPreference(slot = slot, requester = requester, pref = pref)
                pref_link.save()

        data = PrefSignUpSheetSerializer(post.prefsignup, context={'is_owner': True, 'requester': requester.username})

        print 'Updated the Pref-based sign up after preference create'
        print data.data

        return Response(data.data, status=status.HTTP_201_CREATED)


'''
    This viewset is called when an originator tries to resolve
    the signup schedule for a pref-based signup
'''
class ResolveSignupView(viewsets.ModelViewSet):
    serializer_class = PrefSignUpSheetSerializer
    queryset = PrefSignUp.objects.all()


    '''
        This function returns a possible assignment for a pref-base
        signup with post_pk


    '''
    def list(self, request, post_pk, *args, **kwargs):
        print 'Possible Assignment of Schedule'
        post = Post.objects.get(pk = post_pk)
        post_owner = post.author
        requester = Account.objects.get(email=request.user.email)

        if requester != post_owner:
            print 'ResolveSignUpView called by non-owner!'
            return Response(status=status.HTTP_403_FORBIDDEN)

        if hasattr(post, 'prefsignup'):
            print 'this is a prefsignup'
        else:
            print 'this is NOT a prefsignup'
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if post.prefsignup.resolved:
            print 'This pref-based signup is already resolved'
            return Response(status=status.HTTP_400_BAD_REQUEST)


        requester_list = list(post.shared_with.all())
        slot_queryset = PrefSignUpSlot.objects.filter(block__sheet__post = post)
        pref_link_queryset = SignUpPreference.objects.filter(slot__block__sheet__post = post)

        # check if the M2M field contains a particular object
        # slot_queryset.filter(requester_list = aRequester)

        for req in requester_list:
            if req.members.all().count() > 1:
                print 'Not a KGROUP'
            user = req.members.all()[0]

            my_slots = slot_queryset.filter(requester_list = user)

            if my_slots.count() != 0:
                my_pref_links = pref_link_queryset.filter(requester = user).order_by('-pref')
                for link in my_pref_links:
                    potential_slot = link.slot
                    if potential_slot.owner is None or potential_slot.owner == user:

                        print user.username
                        potential_slot.owner = user
                        potential_slot.save()
                        break
                else:
                    continue

        serializer = PrefSignUpSheetSerializer(post.prefsignup,
                                                   context={'is_owner': True,
                                                            'requester': post_owner.username})

        print 'This is one potential assignment'
        print serializer.data
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


    '''
        This function is called by originator to resolve the schedule

        Expect:
            1. a list of begin time
            2. a list of end time
            3. a list of usernames (if owner not set, expect empty string)
    '''
    def create(self, request, *args, **kwargs):

        requester = Account.objects.get(email=request.user.email)
        post = Post.objects.get(pk = request.data['postPk'])
        post_owner = post.author

        if post_owner != requester:
            print 'Non- owner is trying to resolve the schedule'
            return Response(status=status.HTTP_403_FORBIDDEN)

        if post.prefsignup.resolved:
            print 'Schedule is already resolved for post: ',post.pk
            return Response(status=status.HTTP_400_BAD_REQUEST)

        username_list = requester.data['ownerList']


        pref_slot_queryset = PrefSignUpSlot.objects.filter(block__sheet__post = post).order_by('start_time')

        for i in range(0, len(pref_slot_queryset)):
            if username_list[i] != 'na':
                owner = Account.objects.get(username = username_list[i])
                pref_slot_queryset[i].owner = owner
            else:
                pref_slot_queryset[i].owner = None

        post.prefsignup.resolved = True

        serializer = PrefSignUpSheetSerializer(post.prefsignup,
                                               context={'is_owner': True,
                                                        'requester': post_owner.username})

        print 'final resolution:'
        print serializer.data

        return Response(status=status.HTTP_202_ACCEPTED)