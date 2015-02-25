from rest_framework import serializers

from authentication.serializers import AccountSerializer
from posts.models import Pud


class PudSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Pud

        fields = ('id', 'author', 'content', 'notification', 'priority', 'priority_int', 'duration', 'is_completed',
                  'repeat', 'repeat_int', 'need_repeat', 'notify_when', 'assignedToPost', 'firstAssignedWeek',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PudSerializer, self).get_validation_exclusions()

        return exclusions + ['author']
