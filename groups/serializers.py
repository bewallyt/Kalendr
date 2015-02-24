from rest_framework import serializers

from authentication.serializers import AccountSerializer
from groups.models import KGroup


class GroupSerializer(serializers.ModelSerializer):
    owner = AccountSerializer(read_only=True, required=False)
    members = AccountSerializer(read_only=True, many=True)

    class Meta:
        model = KGroup
        fields = ('id', 'name', 'owner', 'members', 'is_follow_group', 'created_at', 'updated_at')


    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(GroupSerializer, self).get_validation_exclusions()
        return exclusions + ['owner']
