from django.db import models

from authentication.models import Account

class CalGroup(models.Model):
    name = models.CharField(max_length=40)
    owner = models.CharField(max_length=40, blank=True)
    members = models.CharField(max_length=40, blank=True)
    private = models.BooleanField(default=True)

    # class Meta:
    #     unique_together = (
    #         ("name", "owner"),
    #     )

    def __unicode__(self):
        return self.name

