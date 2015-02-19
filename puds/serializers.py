from rest_framework import serializers

from authentication.serializers import AccountSerializer
from posts.models import Pud


class PudSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Pud

        fields = ('id', 'author', 'content', 'created_at', 'updated_at', 'priority',
                  'repeat', 'need_repeat', 'is_completed', 'duration', 'notification', 'priority_int', 'repeat_int')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PudSerializer, self).get_validation_exclusions()

        return exclusions + ['author']
