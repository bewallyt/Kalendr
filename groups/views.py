from rest_framework import viewsets, status

from rest_framework.response import Response

from authentication.models import Account

from groups.models import KGroup
from groups.serializers import GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = KGroup.objects.all()
    account_queryset = Account.objects.all()
    serializer_class = GroupSerializer

    '''
    # expecting:
    name: group_name
    members:
        [
            member_username1,
            member_username2
        ]

    '''

    def perform_create(self, serializer):

        account_members = []

        print 'request'
        print self.request.data

        print self.request.data['members'][0]['username']

        for member in self.request.data['members']:
            for a in self.account_queryset:
                if member['username'] == a.username:
                    account_members.append(a)

        instance = serializer.save(owner=self.request.user, members=account_members)
        return super(GroupViewSet, self).perform_create(serializer)



class AccountGroupsViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.select_related('owner')
    serializer_class = GroupSerializer

    '''
    # returns: a list of KGroups
    '''

    def list(self, request, account_username=None):
        print 'in list'

        queryset = self.queryset.filter(owner__username=account_username)

        for e in queryset:
            print 'first queryset: '
            print 'group name: ' + e.name
            print 'group owner: ' + e.owner.username
            print 'number of members: ' + str(e.members.count())
            for m in e.members.all():
                print 'group members: ' + m.username

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class AccountFollowingViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.all()
    serializer_class = GroupSerializer

    def list(self, request, account_username=None):
        print 'in follower API'

        # for e in self.queryset:
        #     print 'first queryset: '
        #     print 'group name: ' + e.name
        #     print 'group owner: ' + e.owner.username
        #     print 'number of members: ' + str(e.members.count())
        #     for m in e.members.all():
        #         print 'group members: ' + m.username

        queryset = self.queryset.filter(members__username=account_username)

        # for e in queryset:
        #     print 'queryset: '
        #     print e.name
        # print 'my account: ' + account_username
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    