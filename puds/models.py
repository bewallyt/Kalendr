from django.db import models
from authentication.models import Account
from django.utils.datetime_safe import datetime


class Pud(models.Model):
    author = models.ForeignKey(Account)
    content = models.CharField(max_length=40)
    notification = models.BooleanField(default=False)

    priority = models.CharField(max_length=15)
    priority_int = models.IntegerField(blank=True, default=0)  # low priority
    duration = models.IntegerField(blank=True, default=0)  # takes no time
    is_completed = models.BooleanField(default=False)

    repeat = models.CharField(max_length=10, blank=True, default='Perpetual')
    repeat_int = models.IntegerField(blank=True, default=0)  # perpetual
    need_repeat = models.BooleanField(default=False)

    notify_when = models.IntegerField(blank=True, default=0)

    assignedToPost = models.BooleanField(default=False)
    firstAssignedWeek = models.IntegerField(blank=True, default=-1)

    expiry_time = models.DateTimeField(default=datetime.now())
    expiry_day = models.IntegerField(blank=True, default=32)
    expiry = models.DateTimeField(default=datetime.now())
    expires = models.BooleanField(default=False)
    escalate = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '{0}'.format(self.content)