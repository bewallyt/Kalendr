from django.db import models
from authentication.models import Account
from posts.models import Post


class FreeTimeRequest(models.Model):
    event_type = models.IntegerField(default=0)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration_hrs = models.PositiveIntegerField()
    duration_min = models.PositiveIntegerField()

    def __unicode__(self):
        return '{0}--{1}'.format(self.start_time, self.end_time)


class Conflict(models.Model):
    user = models.ForeignKey(Account)
    post = models.ForeignKey(Post)
    is_conflict = models.BooleanField(default=False)
    is_one_off = models.BooleanField(default=False)