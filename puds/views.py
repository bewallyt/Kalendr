from rest_framework import viewsets, permissions
from rest_framework.response import Response

from puds.models import Pud
from puds.permissions import IsAuthorOfPud
from puds.serializers import PudSerializer
from mail.mail import send_pud


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

    def partial_update(self, request, *args, **kwargs):
        print 'in partial update'


class AccountPudsViewSet(viewsets.ViewSet):
    queryset = Pud.objects.select_related('author')
    serializer_class = PudSerializer
    print 'in accountpudsview'

    def list(self, request, account_username=None):
        print 'in list of accountpudsview'

        queryset = self.queryset.filter(author__username=account_username).filter(is_completed=False)
        serializer = self.serializer_class(queryset, many=True)

        for pud in queryset.filter(is_completed=False).filter(notification=True):
            pud.notification = False
            pud.save()
            send_pud(pud)

        return Response(serializer.data)


class AccountCompletePudViewSet(viewsets.ViewSet):
    print 'in complete pud view set'
    queryset = Pud.objects.all()
    serializer_class = PudSerializer

    def list(self, request, account_username=None, pud_pk=None, complete_pk=None):
        print "ABOUT TO COMPLETE!! puds views"
        print 'account username: ' + account_username
        print 'pud id: ' + pud_pk
        print 'pud completed: ' + complete_pk
        queryset = self.queryset.filter(author__username=account_username).filter(is_completed=False)
        spec_pud = queryset.get(id=pud_pk)
        spec_pud.is_completed = True
        spec_pud.save()
        incomplete_puds = self.queryset.filter(author__username=account_username).filter(is_completed=False)
        serializer = self.serializer_class(incomplete_puds, many=True)
        return Response(serializer.data)
