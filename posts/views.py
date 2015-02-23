from rest_framework import permissions, viewsets
from rest_framework.response import Response

from posts.models import Post
from posts.permissions import IsAuthorOfPost
from posts.serializers import PostSerializer
from posts.repeat import repeat_events
from django.core.mail import send_mail
from rest_framework import status

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

    def partial_update(self, request, pk, **kwargs):
        post = self.get_queryset().filter(pk=pk)
        updated_post = self.serializer_class(post, data = request.data, partial=True)
        if updated_post.is_valid():
            updated_post.save()
            return Response(updated_post.data, status=status.HTTP_200_OK)
        return Response(updated_post.errors, status=status.HTTP_304_NOT_MODIFIED)


# Used to get the list of posts that are shared with the user but the user hasn't responded yet
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

        serializer = self.serializer_class(noresponse_posts, many=True)

        Response(serializer.data, status=status.HTTP_200_OK)


# For list, create, update  and destroy posts of the logged in user
class AccountPostsViewSet(viewsets.ViewSet):
    queryset = Post.objects.select_related('author')
    serializer_class = PostSerializer

    def list(self, request, account_username=None, post_pk=None):

        queryset = self.queryset.filter(author__username=account_username)

        for e in queryset:

            if e.need_repeat:
                e.need_repeat = False
                e.save()
                repeat_events(e)
            if e.is_date_set == False:
                e.is_date_set = True
                e.show_date = str(e.start_time)[5:7] + "/" + str(e.start_time)[8:10] + "/" + str(e.start_time)[0:4]
                e.show_begin_time = str(e.begin_time)[11:16]
                e.show_end_time = str(e.begin_time)[11:16]
                e.save()
            if e.is_week_set == False:
                e.is_week_set = True
                if e.day_of_week == 'Sunday':
                    e.week_num = e.start_time.isocalendar()[1] + 1
                else:
                    e.week_num = e.start_time.isocalendar()[1]
                print 'day of week: ' + str(e.week_num)
                e.save()

        if post_pk == None or post_pk == 0:
            print 'post_pk dne'
            post_pk = datetime.datetime.today().isocalendar()[1]

        filtered_set = queryset.filter(notification='True')
        filtered_week = queryset.filter(week_num = post_pk)
        queryset = filtered_week.order_by('-start_time')
        queryset = queryset.reverse()


        serializer = self.serializer_class(queryset, many=True)


        for notify_post in filtered_set:
            send_mail(notify_post.content, 'Kalendr reminder - event at: ' + notify_post.show_begin_time,
                      'kalendr458@gmail.com', [notify_post.author.email],
                      fail_silently=False)


        return Response(serializer.data)
