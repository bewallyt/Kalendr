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

        count = 0
        for member in self.request.data['members']:
            for a in self.account_queryset:
                if member['username'] == a.username:
                    count = count + 1
                    account_members.append(a)

        instance = serializer.save(owner=self.request.user, members=account_members, num_members = count)
        return super(GroupViewSet, self).perform_create(serializer)

# return all groups (follwer and non-follower) that account_username owns
class AccountGroupsViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.select_related('owner')
    serializer_class = GroupSerializer

    def list(self, request, account_username=None):
        print 'in list'

        queryset = self.queryset.filter(owner__username=account_username)

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)



# return all follower groups that account_username owns
class AccountFollowerGroupsViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.select_related('owner')
    serializer_class = GroupSerializer

    '''
    # returns: a list of KGroups
    '''

    def list(self, request, account_username=None):
        print 'my follower in list'

        queryset = self.queryset.filter(owner__username=account_username, is_follow_group=True)

        '''
        for e in queryset:
            print 'first queryset: '
            print 'group name: ' + e.name
            print 'group owner: ' + e.owner.username
            print 'number of members: ' + str(e.members.count())
            for m in e.members.all():
                print 'group members: ' + m.username
        '''
        serializer = self.serializer_class(queryset, many=True)
        print serializer.data
        return Response(serializer.data)


# return non-follower groups that account_username owns
class AccountNonFollowerGroupsViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.select_related('owner')
    serializer_class = GroupSerializer

    def list(self, request, account_username=None):
        print 'in list'

        queryset = self.queryset.filter(owner__username=account_username, is_follow_group=False)

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


# Returns all groups that account_username is a member of
class AccountFollowingViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.all()
    serializer_class = GroupSerializer

    def list(self, request, account_username=None):
        print 'in follower API'

        queryset = self.queryset.filter(members__username=account_username)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

# Returns all following groups that account_username is a member of
class AccountFollowingPersonViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.all()
    serializer_class = GroupSerializer

    def list(self, request, account_username=None):
        print 'in member following API'

        queryset = self.queryset.filter(members__username=account_username)
        queryset = queryset.filter(is_follow_group=True)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

# Returns all non-following groups that account_username is a member of
class AccountFollowingGroupViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.all()
    serializer_class = GroupSerializer

    def list(self, request, account_username=None):
        print 'in member non-following group API'

        queryset = self.queryset.filter(members__username=account_username)
        queryset = queryset.filter(is_follow_group=False)

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

class AccountLatestGroupViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.select_related('owner')
    serializer_class = GroupSerializer

    def list(self, request, account_username=None):
        print 'in latest list'

        queryset = self.queryset.filter(owner__username=account_username)
        latest = queryset.latest('created_at')

        serializer = self.serializer_class(latest)
        print serializer.data

        return Response(serializer.data)
