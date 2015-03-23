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
        print 'in_create'
        serializer = FreeTimeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ftrequest = serializer.save() # don't save it later
        print request.data
        print ftrequest
        print ftrequest.event_type
        print ftrequest.start_date
        print ftrequest.end_date
        print ftrequest.start_time
        print ftrequest.end_time
        print ftrequest.duration_hrs
        print ftrequest.duration_min
        print request.data['users_following']
        print request.data['which_days']

        users = [Account.objects.get(username=username) for username in request.data['users_following']]
        conflicts = [Conflict(user=user, is_conflict=False) for user in users]

        c_serializer = ConflictSerializer(conflicts, many=True)
        headers = self.get_success_headers(c_serializer.data)
        return Response(c_serializer.data, headers=headers)
