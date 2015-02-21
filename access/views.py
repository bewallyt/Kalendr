from django.shortcuts import render
from authentication.models import Account
from posts.models import Post
from groups.models import KGroup
from access.models import AccessRule
from access.serializers import AccessRuleSerializer
from groups.serializers import GroupSerializer
from posts.serializers import PostSerializer
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import json

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

    # '''
    # # expecting:
    # post: post_id
    # rules:
    # [
    # (group: group_name1, visibility: 'ALL'),
    # (group: group_name2, visibility: 'MOD'),
    # ]
    # # order of rule determined from position in list
    # # set all rules at once
    # '''
    # def perform_create(self, serializer):
    #     post = Post.objects.get(id=self.request.data['post'])
    #
    #     order = 0
    #     for rule in self.request.data['rules']:
    #         group_name = rule['group']
    #
    #         rule['order'] = order
    #         rule['post'] = post
    #         rule['group'] = KGroup.objects.filter(owner=self.request.user).get(name=group_name)
    #         serializer = self.serializer_class(rule)
    #         instance = super(AccessViewSet, self).perform_create(serializer)
    #         order += 1
    #     return instance

    '''
    # expecting:
    post: post_id
    group: group_name
    order: int
    visibility: 'ALL'
    # make this call in a loop -- (post is the same every iteration)
        for each rule: create(post, group, order, visibility)
      where order starts from 0 and increments
    '''
    def perform_create(self, serializer):
        print 'in perform create:'

        post = Post.objects.get(id=self.request.data['post'])
        group = KGroup.objects.filter(owner=self.request.user).get(name=self.request.data['group'])

        renderer = JSONRenderer()

        self.request.data['post'] = json.loads(renderer.render(PostSerializer(post).data))
        self.request.data['group'] = json.loads(renderer.render(GroupSerializer(group).data))

        serializer = self.serializer_class(self.request.data)
        return super(AccessViewSet, self).perform_create(serializer)


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
