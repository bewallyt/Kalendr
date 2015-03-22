from rest_framework import viewsets
from rest_framework.response import Response
from freetime.models import FreeTimeRequest, Conflict
from freetime.serializers import FreeTimeRequestSerializer, ConflictSerializer
from rest_framework import status


class FreeTimeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FreeTimeRequest.objects.all()
    serializer_class = FreeTimeRequestSerializer

    '''
    Expecting:
    {
        users:
            [
                {username: string}
            ]
        is_recurring: boolean
        end_date: datetime
        days: int array (0-6 inclusive, ordered)
        start_time: time
        end_time: time
        duration: int (measured in number of minutes)
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
    '''
    def list(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)
