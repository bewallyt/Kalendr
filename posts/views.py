from rest_framework import permissions, viewsets
from rest_framework.response import Response

from posts.models import Post
from posts.permissions import IsAuthorOfPost
from posts.serializers import PostSerializer
from posts.repeat import repeat_events, find_repeat
from django.core.mail import send_mail

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

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(author__username=account_username)
        filtered_set = queryset.filter(notification='True')
        queryset = queryset.order_by('-start_time')
        queryset = queryset.reverse()


        for e in queryset:

            if e.need_repeat:
                e.need_repeat = False
                e.save()
                repeat_events(e)
            if e.is_date_set == False:
                e.show_date = str(e.start_time)[5:7] + "/" + str(e.start_time)[8:10] + "/" + str(e.start_time)[0:4]
                e.show_begin_time = str(e.begin_time)[11:16]
                e.show_end_time = str(e.begin_time)[11:16]
                e.save()

        serializer = self.serializer_class(queryset, many=True)


        for notify_post in filtered_set:
            send_mail(notify_post.content, 'Kalendr reminder - event at: ' + notify_post.show_begin_time,
                      'kalendr458@gmail.com', [notify_post.author.email],
                      fail_silently=False)

        print 'in account post view'

        return Response(serializer.data)
