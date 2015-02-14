from django.db import models

from authentication.models import Account

class KGroup(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(Account, related_name='mygroups', blank = True)
    members = models.ManyToManyField(Account)

    def __unicode__(self):
        return '{0}'.format(self.name)
