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

    freetime_recurring = models.BooleanField(default=False)
    start_date = models.CharField(max_length=50, default='')
    end_date = models.CharField(max_length=50, default='')
    which_days = models.CharField(max_length=100, default='')
    start_time = models.CharField(max_length=50, default='')
    end_time = models.CharField(max_length=50, default='')
    duration_hrs = models.PositiveIntegerField(default=0)
    duration_min = models.PositiveIntegerField(default=0)
    
    def __unicode__(self):
        return '{0}: {1}'.format(self.user, self.is_conflict)

    @staticmethod
    def cmp(x, y):
        alphabetical = cmp(x.user.username, y.user.username)
        if alphabetical != 0:
            return alphabetical
                
        if not x.is_conflict or not y.is_conflict:
            return 0
            
        date = cmp(x.post.start_time, y.post.start_time)
        if date != 0:
            return date
            
        return cmp(x.post.begin_time, y.post.begin_time)