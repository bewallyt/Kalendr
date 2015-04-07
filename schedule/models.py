from django.db import models

class ScheduleRequest(models.Model):
    format = models.IntegerField(default=0)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    
    def __unicode__(self):
        return '{0}--{1}'.format(self.start_date, self.end_date)