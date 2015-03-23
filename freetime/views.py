from rest_framework import viewsets
from rest_framework.response import Response
from freetime.models import FreeTimeRequest, Conflict
from freetime.serializers import FreeTimeRequestSerializer, ConflictSerializer
from authentication.models import Account

'''
Returns a list of datetime ranges, where each element in the list is a 2-tuple (begin, end)
'''
def calculate_search_times(weekdays, start_time, end_time, is_recurring, start_date, end_date):
    return []


'''
Returns a list of conflict objects
for each user, for each post visible to requesting_user, during the time_ranges
'''
def find_conflicts(users, time_ranges, requesting_user):
    conflicts = [Conflict(user=user, is_conflict=False) for user in users]
    return conflicts

    # for user in users:
    #     for (start, end) in time_ranges:
    #         for #see AccountAccessViewSet.list
    #
    # for each user:
    #     for each date in request.dates:
    #         for each post user shared with me on that date:
    #             if all day || post.begin_time or post.end_time in the request.range (begintime to endtime)
    #                 add conflict to list


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

        # unpack input
        is_recurring = validated_data['event_type'] == 1
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        start_time = validated_data['start_time']
        end_time = validated_data['end_time']
        weekdays = data['which_days']
        users = [Account.objects.get(username=username) for username in data['users_following']]

        # calculation
        time_ranges = calculate_search_times(weekdays, start_time, end_time, is_recurring, start_date, end_date)
        conflicts = find_conflicts(users, time_ranges, request.user)

        # serialize output
        serializer = ConflictSerializer(conflicts, many=True)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, headers=headers)

