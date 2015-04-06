from django.db import models
from django.utils.timezone import now
from datetime import timedelta

class ScheduleRequest(models.Model):
    format = models.IntegerField(default=0)
    start_date = models.DateTimeField(blank=True, default=now())
    end_date = models.DateTimeField(blank=True, default=now() + timedelta(weeks=1))
    
    def __unicode__(self):
        return '{0}--{1}'.format(self.start_date, self.end_date)