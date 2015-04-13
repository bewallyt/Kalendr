from rest_framework import viewsets, permissions
from rest_framework.response import Response

from puds.models import Pud
from puds.permissions import IsAuthorOfPud
from puds.serializers import PudSerializer
from mail.mail import send_pud
import datetime as dt
from dateutil import tz


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

        queryset = self.queryset.filter(author__username=account_username)
        expiring_puds = queryset.filter(expires=True)
        for pud in expiring_puds:
            completeescalate(pud)
        final_queryset = self.queryset.filter(author__username=account_username).filter(is_completed=False)
        serializer = self.serializer_class(final_queryset, many=True)

        for pud in final_queryset.filter(is_completed=False).filter(notification=True):
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


def completeescalate(pud):  # refactor! extract duplicated logic blocks
    priority = ['low', 'normal', 'high', 'urgent']
    est = tz.gettz('America/New_York')
    utc = tz.gettz('UTC')
    eastern_time = dt.datetime.now().replace(tzinfo=utc).astimezone(est)
    ex_time = pud.expiry_time.replace(tzinfo=utc).astimezone(est).time()
    if pud.repeat_int == 0:  # perpetual
        if eastern_time.date() > pud.expiry.date():
            pud.is_completed = True
            pud.save()
        elif eastern_time.date() == pud.expiry.date():
            if eastern_time.time() >= ex_time:
                pud.is_completed = True
                pud.save()
        elif (pud.expiry.date() - eastern_time.date()).days <= 7:
            if pud.escalate and pud.last_escalated.date() != eastern_time.date():
                if pud.priority_int < 3:
                    pud.last_escalated = eastern_time()
                    pud.priority_int += 1
                    pud.save()
                    pud.priority = priority[pud.priority_int]
                    pud.save()
    elif pud.repeat_int == 1:  # daily
        if eastern_time.time() >= ex_time:
            pud.is_completed = True
            pud.save()
    elif pud.repeat_int == 2:  # weekly
        weekday_adjusted = pud.expiry_day - 1
        if weekday_adjusted == -1:
            weekday_adjusted = 6
        if eastern_time.weekday() > weekday_adjusted:
            pud.is_completed = True
            pud.save()
        elif eastern_time.weekday() == weekday_adjusted:
            if eastern_time.time() >= ex_time:
                pud.is_completed = True
                pud.save()
        else:
            if pud.escalate and pud.last_escalated.date() != eastern_time.date():
                if pud.priority_int < 3:
                    pud.last_escalated = eastern_time()
                    pud.priority_int += 1
                    pud.save()
                    pud.priority = priority[pud.priority_int]
                    pud.save()
    else:  # monthly
        if eastern_time.day > pud.expiry_day:
            pud.is_complete = True
            pud.save()
        elif eastern_time.day == pud.expiry_day:
            if eastern_time.time() >= ex_time:
                pud.is_completed = True
                pud.save()
        elif pud.expiry_day - eastern_time.day <= 7:
            if pud.escalate and pud.last_escalated.date() != eastern_time.date():
                if pud.priority_int < 3:
                    pud.last_escalated = eastern_time()
                    pud.priority_int += 1
                    pud.save()
                    pud.priority = priority[pud.priority_int]
                    pud.save()
    return pud