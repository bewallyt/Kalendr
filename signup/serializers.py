'''
    Serializer for SignUp objects
    Question: If SignUp uses customized manager
'''
from rest_framework import serializers
from signup.models import SignUp, TimeBlock, SignUpSlot
class SignUpSheetSerializer(serializers.ModelSerializer):

    class Meta:
        model = SignUp
