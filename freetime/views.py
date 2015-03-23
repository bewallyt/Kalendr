from rest_framework import viewsets
from rest_framework.response import Response
from freetime.models import FreeTimeRequest, Conflict
from freetime.serializers import FreeTimeRequestSerializer, ConflictSerializer
from authentication.models import Account


class FreeTimeViewSet(viewsets.ModelViewSet):
    queryset = FreeTimeRequest.objects.all()
    serializer_class = FreeTimeRequestSerializer

    '''
    Expecting:
    {
        users_following: string array
        event_type: {0,1} #1 if is_recurring
        start_date: datetime
        end_date: datetime
        which_days: int array (0-6 inclusive, ordered)
        start_time: datetime
        end_time: datetime
        duration_hrs: int
        duration_min: int
    }

    Returning:
    [
        {
            user: Account
            is_conflict: boolean
            post: Post
            is_one_off: boolean
        }
    ]
    where the list is ordered by the user, and then chronologically by post time
    '''
    def create(self, request):
        # validate data, but don't store in db
        data = request.data
        request_serializer = FreeTimeRequestSerializer(data=data)
        request_serializer.is_valid(raise_exception=True)
        validated_data = request_serializer.validated_data

        is_recurring = validated_data['event_type'] == 1
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        start_time = validated_data['start_time']
        end_time = validated_data['end_time']
        weekdays = data['which_days']
        users = [Account.objects.get(username=username) for username in data['users_following']]

        conflicts = [Conflict(user=user, is_conflict=False) for user in users]

        serializer = ConflictSerializer(conflicts, many=True)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, headers=headers)
