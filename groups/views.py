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
            {username: member_username1},
            {username: member_username2}
        ]

    '''

    def perform_create(self, serializer):

        account_members = []

        print 'request'
        print self.request.data
        print serializer.is_valid()

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
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class AccountFollowingViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.all()
    serializer_class = GroupSerializer

    def list(self, request, account_username=None):
        print 'in follower API'

        queryset = self.queryset.filter(members__username=account_username)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class AccountSpecificGroupViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.all()
    serializer_class = GroupSerializer

    def list(self, request, account_username=None):
        print 'in groupSpeciific API'


        queryset = self.queryset.filter(created_at=account_username)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    