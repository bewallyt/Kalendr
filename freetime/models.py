from django.db import models
from authentication.models import Account
from posts.models import Post


class FreeTimeRequest(models.Model):
    duration = models.PositiveIntegerField()
    start_time = models.CharField(max_length=50)
    end_time = models.CharField(max_length=50)
    is_recurring = models.BooleanField(default=False)
    end_date = models.DateTimeField(blank=True, null=True)

    def __unicode__(self):
        return '{0}--{1}'.format(self.start_time, self.end_time)


class Conflict(models.Model):
    user = models.ForeignKey(Account)
    post = models.ForeignKey(Post)
    is_conflict = models.BooleanField(default=False)
    is_one_off = models.BooleanField(default=False)