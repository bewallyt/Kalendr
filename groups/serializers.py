from rest_framework import serializers
from authentication.serializers import AccountSerializer
from groups.models import CalGroup

class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = CalGroup
        fields = ('name', 'owner', 'members')
        read_only_fields = ()



