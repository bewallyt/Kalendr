from django.shortcuts import render
from authentication.models import Account
from posts.models import Post
from groups.models import KGroup
from access.models import AccessRule
from access.serializers import AccessRuleSerializer
from rest_framework import permissions, viewsets
from rest_framework.response import Response

class AccessViewSet(viewsets.ModelViewSet):
    queryset = AccessRule.objects.order_by('order')
    serializer_class = AccessRuleSerializer

    def perform_create(self, serializer):
        print 'in perform create:'

        return super(AccessViewSet, self).perform_create(serializer)

    '''
    post: p0
    # return all rules for a post
    '''
    def list(self, request):
        post = Post.objects.get(id=request.post)
        queryset = self.queryset.filter(post=post)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    '''
    post: p0
    rules:
        [
            (group = g2, visibility = 'ALL')
            (group = g1, visibility = 'MOD')
        ]
    # order of rule determined from position in list
    # set all rules at once (takes care of modify/delete)
    '''
    def create(self, request):
        print 'in create'

        post = Post.objects.get(id=request.post)
        self.queryset.filter(post=post).delete()

        order = 0
        for rule in request.rules:
            self.perform_create(self.serializer_class(
                post=post,
                group=KGroup.objects.filter(owner=self.request.user).get(id=rule.group),
                visibility=rule.visibility,
                order=order
            ))
            order += 1


class AccountAccessViewSet(viewsets.ViewSet):
    queryset = AccessRule.objects.select_related('group')
    serializer_class = AccessRuleSerializer

    def list(self, request, account_username=None):
        print 'in list'

        # first get complete set of access rules for each group that I am a member of
        user = Account.objects.get(username=account_username)
        groups = user.kgroup_set.all()
        queryset = self.queryset.none()
        for group in groups:
            queryset = queryset | self.queryset.filter(group=group)

        # then eliminate duplicates for a given post, taking only the highest ranked
        # queryset = queryset.order_by('post', 'order').distinct('post'); requires PostgreSQL
        queryset = queryset.order_by('order')
        posts_seen = set()
        rules_to_remove = set()
        for rule in queryset:
            if rule.post.id in posts_seen:
                rules_to_remove.add(rule)
            else:
                posts_seen.add(rule.post.id)

        for rule in rules_to_remove:
            queryset = queryset.exclude(group=rule.group, post=rule.post)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
