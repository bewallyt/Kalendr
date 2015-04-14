'''
    Serializer for SignUp objects
    Question: If SignUp uses customized manager
'''
from rest_framework import serializers
from pre_signup.models import PrefSignUp, PrefTimeBlock, PrefSignUpSlot, SignUpPreference

class PrefSignUpSlotSerializer(serializers.ModelSerializer):
    requester_list = serializers.SerializerMethodField()

    def get_requester_list(self, obj):
        requester_set = obj.requester_list.all()
        username_list = []
        tuple_list = []

        for requester in requester_set:
            pref_link = SignUpPreference.objects.get(slot = obj,
                                                     requester = requester)
            pref = pref_link.pref
            tup = (requester.username, pref)
            username_list.append(requester.username)
            tuple_list.append(tup)

        if self.context['is_owner'] == True:
            return tuple_list

        else:
            requester_name = self.context['requester']
            if requester_name in username_list:
                pref_link = SignUpPreference.objects.get(slot = obj,
                                                         requester = requester)
                pref = pref_link.pref
                tup = (requester_name, pref)
                return [tup]
            else:
                return []

    def get_owner(self, obj):
        if obj.owner is None:
            return ''
        else:
            return obj.owner.username


    class Meta:
        model = PrefSignUpSlot

        fields = ('id', 'owner', 'start_time', 'end_time', 'requester_list')

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

