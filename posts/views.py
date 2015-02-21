from rest_framework import permissions, viewsets
from rest_framework.response import Response

from posts.models import Post
from posts.permissions import IsAuthorOfPost
from posts.serializers import PostSerializer
from posts.repeat import repeat_events
from django.core.mail import send_mail

import datetime


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer

    def get_permissions(self):
        print 'in post view'
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfPost(),)

    def perform_create(self, serializer):
        print 'in perform create:'
        instance = serializer.save(author=self.request.user)

        return super(PostViewSet, self).perform_create(serializer)


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


