from rest_framework import serializers

from freetime.models import FreeTimeRequest, Conflict
from authentication.serializers import AccountSerializer
from posts.serializers import PostSerializer


class FreeTimeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreeTimeRequest
        fields = ('event_type', 'start_date', 'end_date', 'start_time', 'end_time', 'duration_hrs', 'duration_min')


class ConflictSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Conflict
        fields = ('user', 'post', 'is_conflict', 'is_one_off',
                  'freetime_recurring', 'start_date', 'end_date', 'which_days', 'start_time', 'end_time',
                  'duration_hrs', 'duration_min', 'post_begin_time', 'post_end_time')