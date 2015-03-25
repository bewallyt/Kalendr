from rest_framework import viewsets
from rest_framework.response import Response
from freetime.models import FreeTimeRequest, Conflict
from freetime.serializers import FreeTimeRequestSerializer, ConflictSerializer
from authentication.models import Account
from posts.models import Post
from access.models import AccessRule
from django.utils.timezone import utc
import datetime
import dateutil.parser

'''
Returns a list of datetime ranges, where each element in the list is a 2-tuple (begin, end)
'''
def calculate_search_times(weekdays, start_time, end_time, is_recurring, start_date, end_date):  
    if not is_recurring:
        start_date = datetime.datetime.now()

    start_date = datetime.datetime(year=start_date.year, month=start_date.month, day=start_date.day, tzinfo=utc)
    ref = datetime.datetime(1970, 1, 1, tzinfo=utc)
    
    search_times = []
    
    if not is_recurring:
        for day in weekdays:
            day_offset = (day - start_date.weekday()) % 7
            begin = start_date + datetime.timedelta(days=day_offset)
            end = begin
            begin = begin + (start_time - ref)
            end = end + (end_time - ref)
            search_times.append((begin, end))    
    else:
        for day in weekdays:
            n = 0
            while True:
                day_offset = (day - start_date.weekday()) % 7 + (n * 7)
                begin = start_date + datetime.timedelta(days=day_offset)
                end = begin
                begin = begin + (start_time - ref)
                end = end + (end_time - ref)
                if end > end_date + datetime.timedelta(days=1):
                    break
                search_times.append((begin, end))
                n += 1
                
    search_times.sort()
    return search_times


'''
Returns a list of conflict objects
for each user, for each post visible to requesting_user, during the time_ranges
'''
def find_conflicts(users, time_ranges, requesting_user, is_recurring):
    conflicts = []
    for user in users:
        conflict_found = False
        
        for post in visible_posts(requesting_user, user):
            post_range = get_post_range(post)

            for freetime_range in time_ranges:
                if times_overlap(freetime_range, post_range):
                    conflict_found = True
                    conflicts.append(Conflict(user=user, post=post, is_conflict=True, is_one_off=is_recurring and post.repeat == ''))
                    break
        
        if not conflict_found:
            conflicts.append(Conflict(user=user, is_conflict=False))
        
    return sorted(conflicts, Conflict.cmp)


'''
Returns all posts that requested_user owns and has shared with the requesting_user,
and also all posts that the requested_user has 'CONFIRMED' that are visible to the requesting_user
'''
def visible_posts(requesting_user, requested_user):
    owner_posts = requested_user.myevents.filter(shared_with__name=requesting_user.username)
    all_visible_posts = Post.objects.filter(shared_with__name=requesting_user.username)
    confirmed_posts = Post.objects.filter(shared_with__name=requested_user.username, accessrule__receiver_response='CONFIRM')

    posts = owner_posts | (all_visible_posts & confirmed_posts)

    for post in posts:
        ac = AccessRule.objects.get(post=post, group__name=requesting_user.username)
        if ac.visibility == 'BUS':
            post.content = 'Busy'
            post.location_event = ''
            post.description_event = ''

    return posts


def get_post_range(post):
    if post.not_all_day:
        date = post.start_time
        begin = datetime.datetime(year=date.year, month=date.month, day=date.day, tzinfo=utc)
        end = begin

        ref = datetime.datetime(1970, 1, 1, tzinfo=utc)
        begin = begin + (dateutil.parser.parse(post.begin_time) - ref)
        end = end + (dateutil.parser.parse(post.end_time) - ref)

        return begin, end
    else:
        return post.start_time, post.start_time + datetime.timedelta(days=1)
    

def times_overlap(range_a, range_b):
    latest_start = max(range_a[0], range_b[0])
    earliest_end = min(range_a[1], range_b[1])
    return latest_start < earliest_end


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
        which_days: int array (0-6 inclusive)
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

            freetime_recurring: boolean
            start_date: string
            end_date: string
            which_days: string (comma separated)
            start_time: string
            end_time: string
            duration_hrs: int
            duration_min: int
            post_begin_time: string
            post_end_time: string
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
        duration_hrs = validated_data['duration_hrs']
        duration_min = validated_data['duration_min']
        weekdays = data['which_days']
        users = [Account.objects.get(username=username) for username in data['users_following']]

        # calculation
        time_ranges = calculate_search_times(weekdays, start_time, end_time, is_recurring, start_date, end_date)
        conflicts = find_conflicts(users, time_ranges, request.user, is_recurring)

        # serialize output
        day_name = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        for conflict in conflicts:
            conflict.freetime_recurring = is_recurring
            if is_recurring:
                conflict.start_date = str(start_date)[5:7] + '/' + str(start_date)[8:10] + '/' + str(start_date)[0:4]
                conflict.end_date = str(end_date)[5:7] + '/' + str(end_date)[8:10] + '/' + str(end_date)[0:4]
            if conflict.is_conflict and conflict.post.not_all_day:
                conflict.post_begin_time = (dateutil.parser.parse(conflict.post.begin_time)-datetime.timedelta(hours=5)).strftime('%I:%M %p')
                conflict.post_end_time = (dateutil.parser.parse(conflict.post.end_time)-datetime.timedelta(hours=5)).strftime('%I:%M %p')
            conflict.which_days = ', '.join(map(lambda x: day_name[x], weekdays))
            conflict.start_time = (start_time-datetime.timedelta(hours=5)).strftime('%I:%M %p')
            conflict.end_time = (end_time-datetime.timedelta(hours=5)).strftime('%I:%M %p')
            conflict.duration_hrs = duration_hrs
            conflict.duration_min = duration_min
        serializer = ConflictSerializer(conflicts, many=True)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, headers=headers)