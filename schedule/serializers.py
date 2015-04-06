from rest_framework import serializers
from schedule.models import ScheduleRequest


class ScheduleRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleRequest
        fields = ('format', 'start_date', 'end_date')

