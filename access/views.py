from django.shortcuts import render
from authentication.models import Account
from posts.models import Post
from groups.models import KGroup
from access.models import AccessRule
from access.serializers import AccessRuleSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

class AccessViewSet(viewsets.ModelViewSet):
    queryset = AccessRule.objects.order_by('order')
    serializer_class = AccessRuleSerializer

    '''
    # expecting:
    post: post_id
    # returns: list of all AccessRules for a post
    # (need to call this only when modifying a post)
    '''
    def list(self, request):
        post = Post.objects.get(id=request.data['post'])
        queryset = self.queryset.filter(post=post)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    '''
    # expecting:
    post: post_id
    rules:
        [
            (group: group_name1, visibility: 'ALL'),
            (group: group_name2, visibility: 'MOD'),
        ]
    # order of rule determined from position in list
    # set all rules at once
    '''
    def create(self, request):
        serializer = self.serializer_class()
        order = 0
        post = Post.objects.get(id=request.data['post'])
        if post.is_holiday:
            return Response(status=status.HTTP_204_NO_CONTENT)
        for rule in request.data['rules']:
            group = KGroup.objects.filter(owner=request.user).get(name=rule['group'])
            rule['order'] = order
            serializer = self.serializer_class(data=rule)
            serializer.is_valid(raise_exception=True)
            serializer.save(post=post, group=group)
            order += 1

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# see shared posts
class AccountAccessViewSet(viewsets.ViewSet):
    queryset = AccessRule.objects.select_related('group')
    serializer_class = AccessRuleSerializer

    '''
    # returns: list of access rules
    '''
    def list(self, request, account_username=None):
        print 'in list'

        # first get complete set of access rules for each group that I am a member of
        user = Account.objects.get(username=account_username)
        groups = user.kgroup_set.all()
        queryset = self.queryset.none()
        for group in groups:
            queryset = queryset | self.queryset.filter(group=group)

        # then eliminate duplicates for a given post, taking only the highest precedence
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
