from django.db import models
from authentication.models import Account


class Pud(models.Model):
    author = models.ForeignKey(Account)
    content = models.CharField(max_length=40)
    notification = models.BooleanField(default=False)

    priority = models.CharField(max_length=15)
    priority_int = models.DecimalField(max_digits=1, decimal_places=0, blank=True, default=0)  # low priority
    duration = models.DecimalField(max_digits=2, decimal_places=0, blank=True, default=0)
    is_completed = models.BooleanField(default=False)

    repeat = models.CharField(max_length=10, blank=True)
    repeat_int = models.DecimalField(max_digits=1, decimal_places=0, blank=True, default=0)  # perpetual
    need_repeat = models.BooleanField(default=False)

    notify_when = models.DecimalField(max_digits=1, decimal_places=0, blank=True, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '{0}'.format(self.content)