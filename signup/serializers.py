'''
    Serializer for SignUp objects
    Question: If SignUp uses customized manager
'''
from rest_framework import serializers
from signup.models import SignUp, TimeBlock, SignUpSlot
from authentication.serializers import AccountSerializer, SimpleAccountSerializer


class SignUpSlotSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()

    def get_owner(self, obj):
        if obj.owner is None:
            return 'Available'
        elif self.context['is_owner'] == False:
            if self.context['requester'] != obj.owner.username:
                return ''
            else:
                return obj.owner.username
        else:
            return obj.owner.username


    class Meta:
        model = SignUpSlot

        fields = ('id', 'start_time', 'end_time', 'owner')

        read_only_fields = ('id', 'start_time', 'end_time')

class TimeBlockSerializer(serializers.ModelSerializer):
    def get_context(self,obj):
        return self.context

    context = serializers.SerializerMethodField()
    myslots = SignUpSlotSerializer(many=True, context=context)

    class Meta:
        model = TimeBlock

        field = ('id', 'start_time', 'end_time', 'myslots')
        read_only_fields = ('id', 'start_time', 'end_time')


class SignUpSheetSerializer(serializers.ModelSerializer):

    def get_type(self, obj):
        return 'signup'

    def get_is_owner(self,obj):
        return self.context


    # This really should be part of the PostSerializer!! OH WELL
    type = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    myblocks = TimeBlockSerializer(many=True, context=is_owner)



    class Meta:
        model = SignUp
        field = ('id', 'type', 'name', 'location', 'max_slots', 'max_duration', 'min_duration',
                 'myblocks','is_owner')

