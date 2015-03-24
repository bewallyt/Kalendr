'''
    Serializer for SignUp objects
    Question: If SignUp uses customized manager
'''
from rest_framework import serializers
from signup.models import SignUp, TimeBlock, SignUpSlot
from authentication.serializers import AccountSerializer, SimpleAccountSerializer


class SignUpSlotSerializer(serializers.ModelSerializer):
    owner = SimpleAccountSerializer(read_only=True, required=False)

    class Meta:
        model = SignUpSlot

        fields = ('id', 'start_time', 'end_time', 'owner')

        read_only_fields = ('id', 'start_time', 'end_time')

class TimeBlockSerializer(serializers.ModelSerializer):
    myslots = SignUpSlotSerializer(many=True)

    class Meta:
        model = TimeBlock

        field = ('id', 'start_time', 'end_time', 'myslots')
        read_only_fields = ('id', 'start_time', 'end_time')


class SignUpSheetSerializer(serializers.ModelSerializer):
    myblocks = TimeBlockSerializer(many=True)


    class Meta:
        model = SignUp
        field = ('id', 'name', 'location', 'max_slots', 'max_duration', 'min_duration',
                 'myblocks')