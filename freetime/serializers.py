from rest_framework import serializers

from freetime.models import *
from authentication.serializers import AccountSerializer
from posts.serializers import PostSerializer


class FreeTimeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreeTimeRequest
        fields = ('duration', 'start_time', 'end_time', 'is_recurring', 'end_date')


class ConflictSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Conflict
        fields = ('user', 'post', 'is_conflict', 'is_one_off')