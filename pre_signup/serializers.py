'''
    Serializer for SignUp objects
    Question: If SignUp uses customized manager
'''
from rest_framework import serializers
from pre_signup.models import PrefSignUp, PrefTimeBlock, PrefSignUpSlot


class PrefSignUpSlotSerializer(serializers.ModelSerializer):
    requester_list = serializers.SerializerMethodField()

    def get_requester_list(self, obj):
        if obj.requester_list is None:
            return []
        else:
            requester_set = obj.requester_list.all()
            if self.context['is_owner'] == True:
                return requester_set.value_list('username', flat=True)

            else:
                requester_name = self.context['requester']
                requester_name_list = requester_set.value_list('username', flat=True)
                if requester_name in requester_name_list:
                    return [requester_name]
                else:
                    return []

    class Meta:
        model = PrefSignUpSlot

        fields = ('id', 'start_time', 'end_time', 'requester_list')

        read_only_fields = ('id', 'start_time', 'end_time')



class PrefTimeBlockSerializer(serializers.ModelSerializer):
    def get_context(self,obj):
        return self.context

    context = serializers.SerializerMethodField()
    myslots = PrefSignUpSlotSerializer(many=True, context=context)

    class Meta:
        model = PrefTimeBlock

        field = ('id', 'start_time', 'end_time', 'myslots')
        read_only_fields = ('id', 'start_time', 'end_time')


class PrefSignUpSheetSerializer(serializers.ModelSerializer):

    def get_type(self, obj):
        return 'prefsignup'

    def get_is_owner(self,obj):
        return self.context


    # This really should be part of the PostSerializer!! OH WELL
    type = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    myblocks = PrefTimeBlockSerializer(many=True, context=is_owner)



    class Meta:
        model = PrefSignUp
        field = ('id', 'type', 'name', 'location', 'duration',
                 'myblocks','is_owner')

