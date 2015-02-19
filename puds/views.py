from rest_framework import viewsets, permissions
from rest_framework.response import Response

from puds.models import Pud
from puds.permissions import IsAuthorOfPud
from puds.serializers import PudSerializer


class PudViewSet(viewsets.ModelViewSet):
    queryset = Pud.objects.order_by('-created_at')
    serializer_class = PudSerializer

    def get_permissions(self):
        print 'in pud view'
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfPud(),)

    def perform_create(self, serializer):
        print 'in pud-perform create:'
        instance = serializer.save(author=self.request.user)

        return super(PudViewSet, self).perform_create(serializer)


class AccountPudsViewSet(viewsets.ViewSet):
    queryset = Pud.objects.select_related('author')
    serializer_class = PudSerializer
    print 'in accountpudsview'

    def list(self, request, account_username=None):
        print 'in list of accountpudsview'

        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
