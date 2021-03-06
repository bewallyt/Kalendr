from django.shortcuts import render
from authentication.models import Account
from groups.serializers import GroupSerializer
from posts.models import Post
from groups.models import KGroup
from access.models import AccessRule
from access.serializers import AccessRuleSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view


'''
    Used to update AccessRule instanced. Could not use partial_update in AccessViewSet because apparently
    django_rest_framework does not support HTTP PATCH requests: https://gist.github.com/ahankinson/4282606
    So we had to create this PartialUpdateView in order to handle HTTP POST request in a different way.
    This is more like a hack
'''
class PartialUpdateView(viewsets.ModelViewSet):
    queryset = AccessRule.objects.order_by('order')
    serializer_class = AccessRuleSerializer
    '''
        post_id
        response
        emailNotification

        update the AccessRule link between post and the follower group of request.user
    '''
    def create(self, request, *args, **kwargs):
        post = Post.objects.get(pk=request.data['post_id'])
        ar = post.accessrule_set.get(group__name=request.user.username)
        ar.notify_receiver = False
        ar.save()

        updated_ar = self.serializer_class(ar, data = request.data, partial=True)
        if updated_ar.is_valid():
            updated_ar.save()
            print ar.receiver_response
            return Response(updated_ar.data, status=status.HTTP_200_OK)
        return Response(updated_ar.errors, status=status.HTTP_304_NOT_MODIFIED)




# Handles creating a single AccessRule
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

    '''
        Create AccessRule between groups and posts

        The format of data that the front-end passed to us is:
         post: post_id
         rule:
            {"group_name1" : "vis_1",
             "group_name2" : "vis_2",
             "group_name3" : "vis_3"}
    '''
    def create(self, request):
        serializer = self.serializer_class()
        order = 0
        post = Post.objects.get(pk=request.data['post'])
        user = Account.objects.get(email = request.user.email)
        group_rule_dict = request.data['rules'] #keys are group names, values are vis strings

        if post.is_holiday:
            return Response(status=status.HTTP_204_NO_CONTENT)

        for group_name in request.data['rules']:

            rule = {}

            group = user.mygroups.get(name=group_name)

            rule['order'] = order
            rule['visibility'] = group_rule_dict.get(group_name)

            #need partial=True for the serializer to parse it
            serializer = self.serializer_class(data=rule, partial=True)
            serializer.is_valid(raise_exception=True)
            if hasattr(post, 'signup') or hasattr(post, 'prefsignup'):
                print 'Shared post is a signup'
                serializer.save(post=post, group=group, receiver_response = 'CONFIRM', notify_receiver = True)
            else:
                serializer.save(post=post, group=group)
            order += 1

        # If a post is shared with a non-follower group, then we should go through the member list and
        # create AccessRule between the post and all the members of the non-follower group. Existing AccessRule
        # are not overwritten
        for group_name in request.data['rules']:
            group = user.mygroups.get(name=group_name)

            if not group.is_follow_group:
                print "this group is not a follower group:"
                print group.name

                group_access = AccessRule.objects.get(post=post, group=group)
                print "this is the already created accessrule for the group:"
                print group_access.visibility

                for member in group.members.all():
                    #Check if an AccessRule is present
                    member_follower_group = user.mygroups.get(name=member.username)
                    print "Member's follower group:"
                    print member_follower_group.name

                    access_query = AccessRule.objects.filter(post = post, group = member_follower_group)
                    if access_query.exists():
                        print "accessRule already exist"
                    else:
                        print "access rule not exist, creating now"
                        AccessRule.objects.create(post=post,
                                                  group=member_follower_group,
                                                  visibility=group_access.visibility,
                                                  order = group_access.order,
                                                  receiver_response = group_access.receiver_response,
                                                  notify_receiver = group_access.notify_receiver)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    # Partial update should work by itself


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
        groups = user.mygroups.all()
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


'''
    Return a list of users who has given a certain response to post
    Expect
    {post_id:      post_id,
     response:  response}
'''
class NotificationResponseView(viewsets.ModelViewSet):
    queryset = AccessRule.objects.all()
    serializer_class = GroupSerializer

    # Here the input parameters have to be named post_pk and res_pk, because when the front-end
    # call this function, it expects the variable names to be *_pk.
    # For example, when it is not call post_pk, this is the error:
    # list() got an unexpected keyword argument 'post_pk'
    def list(self, request, post_pk, res_pk):
        '''
        print "NotificationResponse View"
        print post_pk
        print res_pk
        '''

        post = Post.objects.get(pk=post_pk)
        response_type = res_pk

        follower_groups = post.shared_with.filter(is_follow_group = True, accessrule__receiver_response=response_type)
        '''
        for ag in follower_groups:
            print ag.name
            print response_type
        '''
        serializer = self.serializer_class(follower_groups, many=True)

        return Response(serializer.data)









