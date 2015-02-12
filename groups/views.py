from django.shortcuts import render

from groups.models import CalGroup
from rest_framework.response import Response
from rest_framework import permissions, viewsets, status
from groups.serializers import GroupSerializer
from authentication.models import Account

class AccountGroupsViewSet(viewsets.ViewSet):
    queryset = CalGroup.objects.all()
    print 'in calgroup queryset'
    for e in queryset:
        print e.name

    serializer_class = GroupSerializer

    def list(self, request, account_username):
        queryset = CalGroup.objects.all()
        print 'account_username' + account_username
        serializer_class = GroupSerializer
        # queryset = queryset.filter(owner=account_username)
        print 'in list of accountsgroupsviewset'
        for e in queryset:
            print e.owner

        serializer = serializer_class(queryset, many=True)
        return Response(serializer.data)

class GroupViewSet(viewsets.ModelViewSet):
    #write into db
    queryset = CalGroup.objects.all()
    serializer_class = GroupSerializer

    def create(self, request):
        print 'in create of GVS'
        print request.data
        print request.data['name']
        print request.data['owner']
        print request.data['members']
        #members = request.data['members']
        #request.data.pop('members', None)
        #request.data['members'] = None
        #request.data['members'] = [ Account(username=member) for member in members]

        serializer = self.serializer_class(data=request.data)
        print 'data'

        if serializer.is_valid():
            print 'serializer is valid'
            #member_list = serializer.validated_data['members']
            print serializer.validated_data
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        print 'before serializer errors'
        print  serializer.errors
        print 'before response'
        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

