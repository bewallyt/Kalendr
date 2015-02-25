from django.contrib.auth.models import BaseUserManager
from django.db import models

from authentication.models import Account

class KGroup(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(Account, related_name='mygroups', blank=True)
    members = models.ManyToManyField(Account)
    is_follow_group = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    num_members = models.PositiveIntegerField(default=0)

    def __unicode__(self):
        return '{0}'.format(self.name)
