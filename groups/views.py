from rest_framework import viewsets, status

from rest_framework.response import Response

from authentication.models import Account

from groups.models import KGroup
from groups.serializers import GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = KGroup.objects.all()
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

        instance = serializer.save(owner=self.request.user)
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

    