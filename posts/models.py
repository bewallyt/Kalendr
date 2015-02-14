from django.db import models
from django.utils.datetime_safe import datetime

from authentication.models import Account
from groups.models import KGroup


class Post(models.Model):
    author = models.ForeignKey(Account)
    shared_with = models.ManyToManyField(KGroup, blank=True)
    content = models.CharField(max_length=40)
    start_time = models.DateTimeField(default=datetime.now())
    notification = models.BooleanField(default=False)
    repeat = models.CharField(max_length=10, blank=True)
    location_event = models.CharField(max_length=40, blank=True, default='none')
    description_event = models.CharField(max_length=100, blank=True, default='none')

    begin_time = models.CharField(max_length=50, blank=True, default='none')
    end_time = models.CharField(max_length=50, blank=True, default='none')
    end_repeat = models.DateTimeField(default=datetime.now(), blank=True)
    need_repeat = models.BooleanField(default=False)

    show_date = models.CharField(max_length=20, blank=True, default='none')
    show_begin_time = models.CharField(max_length=20, blank=True, default='none')
    show_end_time = models.CharField(max_length=20, blank=True, default='none')
    not_all_day = models.BooleanField(default=False)
    is_date_set = models.BooleanField(default=False)

    day_of_week = models.CharField(max_length=10, blank=True, default='none')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '{0}'.format(self.content)
