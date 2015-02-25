from rest_framework import serializers

from posts.serializers import PostSerializer
from groups.serializers import GroupSerializer
from access.models import AccessRule


class AccessRuleSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    group = GroupSerializer(read_only=True)

    class Meta:
        model = AccessRule

        fields = ('post', 'group', 'visibility', 'order', 'receiver_response', 'notification_email', 'notify_when')

