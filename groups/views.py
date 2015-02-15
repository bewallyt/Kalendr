from django.shortcuts import render
from groups.models import KGroup
from groups.serializers import GroupSerializer
from rest_framework import permissions, viewsets
from rest_framework.response import Response

class GroupViewSet(viewsets.ModelViewSet):
    queryset = KGroup.objects.all()
    serializer_class = GroupSerializer
    
    def perform_create(self, serializer):
        print 'in perform create'
        instance = serializer.save(owner=self.request.user)

        return super(GroupViewSet, self).perform_create(serializer)    


class AccountGroupsViewSet(viewsets.ViewSet):
    queryset = KGroup.objects.all()
    serializer_class = GroupSerializer
    
    def list(self, request, account_username=None):
        print 'in list'

        queryset = self.queryset.filter(owner__username=account_username)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    