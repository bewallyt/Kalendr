from rest_framework import serializers

from authentication.serializers import AccountSerializer
from posts.models import Post


class PostSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Post

        fields = ('id', 'author', 'content', 'created_at', 'updated_at', 'start_time', 'notification', 'repeat',
                  'location_event', 'description_event', 'begin_time', 'end_time', 'end_repeat', 'show_date',
                  'show_begin_time',
                  'show_end_time', 'not_all_day', 'day_of_week', 'need_repeat', 'is_week_set', 'week_num')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PostSerializer, self).get_validation_exclusions()

        return exclusions + ['author']
