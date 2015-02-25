from rest_framework import permissions, viewsets
from rest_framework.response import Response

from posts.models import Post
from posts.permissions import IsAuthorOfPost
from posts.serializers import PostSerializer, SharedPostSerializer
from posts.repeat import repeat_events
from rest_framework import status
from authentication.models import Account
from access.models import AccessRule
from mail.mail import send_post

import datetime


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_permissions(self):
        print 'in post view'
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfPost(),)

    # get the default queryset to work with. This function should be
    # called instead of the
    def get_queryset(self):
        user = self.request.user
        return Post.objects.all()

    # Create a single new post
    def create(self, request):
        new_post = self.serializer_class(data=request.data)
        if new_post.is_valid():
            new_post.save(author=request.user)
            return Response(new_post.data, status=status.HTTP_201_CREATED)
        return Response(new_post.data, status=status.HTTP_400_BAD_REQUEST)



    # HTTP .patch
    def partial_update(self, request, pk, **kwargs):
        post = Post.objects.get(pk=pk)
        updated_post = self.serializer_class(post, data = request.data, partial=True)
        if updated_post.is_valid():
            updated_post.save()
            return Response(updated_post.data, status=status.HTTP_200_OK)
        return Response(updated_post.errors, status=status.HTTP_304_NOT_MODIFIED)

'''
 Used to get the list of posts that are shared with the user but the user hasn't responded yet
 Or the originator of the post changed the post's content
 This viewset is linked to the notification bar under social bar at the front-end
'''
class NotificationPostView(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        print type(request.user)

        noresponse_posts = queryset.filter(shared_with__name=request.user.username, shared_with__is_follow_group = True,
                                            accessrule__receiver_response='NO_RESP')
        updated_posts = queryset.filter(shared_with__name=request.user.username, shared_with__is_follow_group = True,
                                            accessrule__notify_receiver=True)

        #updated_posts = queryset.filter(share_with__name = request.user.username, )
        posts = noresponse_posts | updated_posts

        serializer = self.serializer_class(posts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# For list, create, update  and destroy posts of the logged in user
class AccountPostsViewSet(viewsets.ViewSet):
    queryset = Post.objects.select_related('author')
    serializer_class = SharedPostSerializer

    def list(self, request, account_username=None, post_pk=None):

        queryset = self.queryset.filter(author__username=account_username)

        for e in queryset:
            # based on need_repeat, create actual repeated events in the db
            if e.need_repeat:
                e.need_repeat = False
                e.save()
                repeat_events(e)
            # Parse start_time(date),begin_time(clock time, optional field), end_time(clock, optional)
            if e.is_date_set == False:
                e.is_date_set = True
                e.show_date = str(e.start_time)[5:7] + "/" + str(e.start_time)[8:10] + "/" + str(e.start_time)[0:4]
                e.show_begin_time = str(e.begin_time)[11:16]
                e.show_end_time = str(e.end_time)[11:16]
                e.save()
            # day_of_week is calculated in the front-end, but not for repeated events.
            if e.is_week_set == False:
                e.is_week_set = True
                if e.day_of_week == 'Sunday':
                    e.week_num = e.start_time.isocalendar()[1] + 1
                else:
                    e.week_num = e.start_time.isocalendar()[1]
                print 'day of week: ' + str(e.week_num)
                e.save()


        # if the date is not provided, set the week number to
        if post_pk == None or post_pk == 0:
            print 'post_pk dne'
            post_pk = datetime.datetime.today().isocalendar()[1]

        filtered_week = queryset.filter(week_num = post_pk)
        queryset = filtered_week.order_by('-start_time')
        queryset = queryset.reverse()

        serializer = self.serializer_class(queryset, many=True)

        # don't use cached queryset
        for notify_post in Post.objects.all().filter(notification=True):
            print notify_post.is_date_set
            print notify_post.show_date
            print notify_post.show_begin_time
            notify_post.notification = False
            notify_post.save()
            send_post(notify_post)

        return Response(serializer.data)



'''
    Update post fields for a single post.
    And flag to notify receivers

    expected input data format:
    post_id: post_id
'''

#TODO: Check permission
class PostUpdateView(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def create(self, request):
        post = Post.objects.get(pk=request.data['post_id'])
        post_owner = post.author

        if post_owner.email == request.user.email:
            # It is the author that's updating the post

            # updating the notify_receiver field in order to notify receiver of this update
            ar_set = post.accessrule_set.all()
            for ar in ar_set:
                ar.notify_receiver = False
                if ar.receiver_response != 'REMOVED':
                    ar.notify_receiver = True
                ar.save()

            updated_post = self.serializer_class(post, data = request.data, partial=True)
            if updated_post.is_valid():
                updated_post.save()
                return Response(updated_post.data, status=status.HTTP_200_OK)

        #else:
            '''
             it is not the owner who's updating the post
             create a copy of the post in receiver's db, share that with the originator for originator's approval
             this "local" copy has temp_post set to True
             front end should only give "approve" and "reject" two option when pop up a view for notification.
             When the originator replies,
             access/views/PartialUpdateView will be triggered. In PartialUpdateView, it should copy the temp post
             to the originator's post, delete the temp post and all accessrule associated
            '''
        return Response(updated_post.errors, status=status.HTTP_304_NOT_MODIFIED)





'''
    Input: a username string
    output: all the posts that the user has shared with me in the correct format
'''
class GetSharedPostView(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = SharedPostSerializer


    '''
        input is the owner's username. This should be easiest for the front end because it can pull
        the follower group name off of the web page.
    '''
    def list(self, request, account_username):
        follower = Account.objects.get(email=request.user.email)
        owner = Account.objects.get(username=account_username)

        owner_posts = owner.myevents.all()

        # Get rid of the posts that I have not responded, declined or removed. Because we don't want to display posts
        # that are shared with me but that I haven't replied or declined or removed
        shared_posts = owner_posts.filter(is_holiday=False, shared_with__name=follower.username, accessrule__receiver_response='CONFIRM')


        # Hide information for BUSY ONLY posts
        for post in shared_posts:
            post.content = owner.username + post.content
            ac = AccessRule.objects.get(post=post, group__name=follower.username)

            if ac.visibility == 'BUS':
                post.content= owner.username + 'Busy'
                post.location_event = ' '
                post.description_event = ' '
            elif ac.visibility == "MOD" and not post.pud:
                post.can_modifty=True

            if post.pud_time:
                post.content = owner.username + "Reserved for PUD"
                post.location_event = ' '
                post.description_event = ' '

        serializer = self.serializer_class(shared_posts, many=True)
        print serializer.data

        return Response(serializer.data,status=status.HTTP_200_OK)









