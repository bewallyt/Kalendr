from django.db import models

from authentication.models import Account

class KGroup(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(Account)
    members = models.ManyToManyField(Account)    

    def __unicode__(self):
        return '{0}'.format(self.name)
