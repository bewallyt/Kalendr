from django.db import models
from django.utils.datetime_safe import datetime

from authentication.models import Account
from groups.models import KGroup
from puds.models import Pud


class Post(models.Model):
    author = models.ForeignKey(Account, related_name='myevents', blank=True,null=True)
    shared_with = models.ManyToManyField(KGroup, blank=True, through='access.AccessRule')

    content = models.CharField(max_length=40)
    start_time = models.DateTimeField(default=datetime.now())
    notification = models.BooleanField(default=False)
    notify_when = models.DateTimeField(default=datetime.now())
    repeat = models.CharField(max_length=10, blank=True)
    location_event = models.CharField(max_length=40, blank=True, default='none')
    description_event = models.CharField(max_length=100, blank=True, default='none')

    begin_time = models.CharField(max_length=50, blank=True, default='')
    end_time = models.CharField(max_length=50, blank=True, default='')
    end_repeat = models.DateTimeField(default=datetime.now(), blank=True)
    need_repeat = models.BooleanField(default=False)

    show_date = models.CharField(max_length=20, blank=True, default='none')
    show_begin_time = models.CharField(max_length=20, blank=True, default='none')
    show_end_time = models.CharField(max_length=20, blank=True, default='none')
    not_all_day = models.BooleanField(default=False)
    is_date_set = models.BooleanField(default=False)

    day_of_week = models.CharField(max_length=10, blank=True, default='none')
    week_num = models.DecimalField(max_digits=2, decimal_places=0, blank=True, default=0)
    is_week_set = models.BooleanField(default=False)
    is_holiday = models.BooleanField(default=False)

    # pud = models.ForeignKey(Pud, null=True)
    pud_time = models.BooleanField(default=False)
    pud = models.CharField(max_length=40, blank=True, default='none')
    duration = models.IntegerField(blank=True, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    can_modifty = models.BooleanField(default=False)

    is_updated = models.BooleanField(default=False)



    '''
        Fields for sign-up sheet.
        Using OneToOne Field as a way to do inheritance.
        Ideally, we do not repreat any information that's already in post,
        but that might introduce problems in the serialization stage. So
        for the sake of simplicity, sign up sheet will be a self-contained model
    '''

    def __unicode__(self):
        return '{0}'.format(self.content)