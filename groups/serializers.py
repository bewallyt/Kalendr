from rest_framework import serializers

from authentication.serializers import AccountSerializer
from groups.models import KGroup


class GroupSerializer(serializers.ModelSerializer):
    owner = AccountSerializer(read_only=True, required=False)
    members = AccountSerializer(many=True)

    class Meta:
        model = KGroup
        fields = ('name', 'owner', 'members')
