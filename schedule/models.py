from django.db import models
from datetime import datetime, timedelta

class ScheduleRequest(models.Model):
    format = models.IntegerField(default=0)
    start_date = models.DateTimeField(blank=True, default=datetime.now())
    end_date = models.DateTimeField(blank=True, default=datetime.now() + timedelta(weeks=1))
    
    def __unicode__(self):
        return '{0}--{1}'.format(self.start_time, self.end_time)