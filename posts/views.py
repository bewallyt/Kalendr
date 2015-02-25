from rest_framework import permissions, viewsets
from rest_framework.response import Response

from posts.models import Post
from puds.models import Pud
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
        print "is this the id passed " + account_username
        print "is this the week number " + post_pk
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
        filtered_week = queryset.filter(week_num=post_pk)
        queryset = filtered_week.order_by('-start_time')
        queryset = queryset.reverse()

        serializer = self.serializer_class(queryset, many=True)

        for notify_post in filtered_set:
            send_mail(notify_post.content, 'Kalendr reminder - event at: ' + notify_post.show_begin_time,
                      'kalendr458@gmail.com', [notify_post.author.email],
                      fail_silently=False)

        return Response(serializer.data)


class AccountSavePudPostViewSet(viewsets.ViewSet):
    queryset = Post.objects.all()
    pud_queryset = Pud.objects.all()
    serializer_class = PostSerializer

    def list(self, request, account_username=None, post_pk=None, week_pk=None):
        print "ABOUT TO SAVE!!!"
        filtered_week = self.queryset.filter(author__username=account_username).filter(week_num=week_pk)
        incomplete_puds = self.pud_queryset.filter(author__username=account_username).filter(is_completed=False)
        duration_order = incomplete_puds.order_by('-duration')
        post = filtered_week.get(id=post_pk)
        fits_in_slot = duration_order.exclude(duration__gt=post.duration)

        if fits_in_slot.exists():
            reorder_priority = fits_in_slot.order_by('-priority_int')
            fit_pud = reorder_priority.first()
            # fit_pud.assignedToPost = True
            # fit_pud.firstAssignedWeek = week_pk
            # fit_pud.save()
            print fit_pud.content
            post.pud = fit_pud.content
        else:
            post.pud = 'No Task Available'

        post.save()
        print post.content
        print post.pud
        return_week = self.queryset.filter(author__username=account_username).filter(week_num=week_pk)
        queryset = return_week.order_by('-start_time')
        queryset = queryset.reverse()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class AccountUpdatePudPostViewSet(viewsets.ViewSet):
    queryset = Post.objects.all()
    pud_queryset = Pud.objects.all()
    serializer_class = PostSerializer
    print 'in acc update pud post view set'

    def list(self, request, account_username=None, post_pk=None):
        print "ABOUT TO UPDATE in post views!!!"
        print 'the account username: ' + account_username
        print 'the pud id: ' + post_pk
        filtered_by_user = self.queryset.filter(author__username=account_username)
        spec_pud = self.pud_queryset.get(id=post_pk)
        filtered_by_post = filtered_by_user.filter(pud=spec_pud.content)
        if filtered_by_post.exists():  # is the pud actually assigned to any post
            ascend_duration = filtered_by_post.order_by('duration')
            for post in ascend_duration:
                incomplete = self.pud_queryset.filter(author__username=account_username).filter(is_completed=False)
                fits = incomplete.order_by('-duration').exclude(duration__gt=post.duration)
                if fits.exists():
                    prior = fits.order_by('-priority_int')
                    fit_pud = prior.first()
                    post.pud = fit_pud.content
                else:
                    post.pud = 'No Task Available'
                post.save()
        return_posts = self.queryset.filter(author__username=account_username).order_by('-start_time').reverse()
        serializer = self.serializer_class(return_posts, many=True)
        return Response(serializer.data)