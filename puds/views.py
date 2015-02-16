from rest_framework import viewsets
from rest_framework.response import Response

from puds.models import Pud
from puds.serializers import PudSerializer


class AccountPudsViewSet(viewsets.ViewSet):
    queryset = Pud.objects.select_related('author')
    serializer_class = PudSerializer
    print 'in accountpudsview'

    def list(self, request, account_username=None):
        print 'in list of accountpudsview'

        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
