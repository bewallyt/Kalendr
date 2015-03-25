from django.test import TestCase
from freetime.serializers import *
from freetime.views import calculate_search_times, times_overlap, find_conflicts
from authentication.models import Account
from posts.models import Post
from groups.models import KGroup
from access.models import AccessRule
import datetime
from django.utils.timezone import utc


class FreeTimeTest(TestCase):
    '''
    bob has a post shared with alice (p0)
    carol has a post, not shared with alice (p1)
    dan has a post, shared with alice, bob (p2) that bob has confirmed
    '''
    def setUp(self):
        alice = Account.objects.create(username='alice', email='alice@gmail.com')
        bob = Account.objects.create(username='bob', email='bob@gmail.com')
        carol = Account.objects.create(username='carol', email='carol@gmail.com')
        dan = Account.objects.create(username='dan', email='dan@gmail.com')
        
        date = datetime.datetime(year=2015, month=3, day=23, tzinfo=utc)
        begin_time = '1970-01-01T12:30:00.000Z'
        end_time = '1970-01-01T17:00:00.000Z'
        p0 = Post.objects.create(author=bob, content='p0', start_time=date, not_all_day=True, begin_time=begin_time, end_time=end_time)
        p1 = Post.objects.create(author=carol, content='p1', start_time=date)
        p2 = Post.objects.create(author=dan, content='p2', start_time=date)

        alice_group0 = KGroup.objects.create(name='alice', owner=bob, is_follow_group=True)
        alice_group0.members.add(alice)
        alice_group0.save()
        alice_group1 = KGroup.objects.create(name='alice', owner=dan, is_follow_group=True)
        alice_group1.members.add(alice)
        alice_group1.save()
        bob_group = KGroup.objects.create(name='bob', owner=dan, is_follow_group=True)
        bob_group.members.add(bob)
        bob_group.save()
        
        a0 = AccessRule.objects.create(post=p0, group=alice_group0, visibility='ALL', order=0)
        a1 = AccessRule.objects.create(post=p2, group=alice_group1, visibility='ALL', order=0)
        a2 = AccessRule.objects.create(post=p2, group=bob_group, visibility='MOD', order=0, receiver_response='CONFIRM')

    def test_deserialize_request(self):
        data = \
            {
                'users_following': ['alice', 'bob'],
                'event_type': 1,
                'start_date': '2015-03-22T00:00',
                'end_date': '2015-03-29T00:00',
                'which_days': [0, 1, 2],
                'start_time': '2015-03-22T05:00',
                'end_time': '2015-03-22T10:00',
                'duration_hrs': 1,
                'duration_min': 0
            }

        serializer = FreeTimeRequestSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        self.assertEqual(validated_data['event_type'], 1)
        self.assertEqual(validated_data['duration_hrs'], 1)
        self.assertEqual(validated_data['duration_min'], 0)
        self.assertEqual(validated_data['event_type'], 1)
        self.assertEqual(validated_data['start_date'].month, 3)
        self.assertEqual(validated_data['end_date'].day, 29)
        self.assertEqual(validated_data['start_time'].hour, 5)
        self.assertEqual(validated_data['end_time'].minute, 0)

    def test_calculate_search_times_no_recurrence(self):
        weekdays = [6, 0, 1, 3, 4]
        start_time = datetime.datetime(year=1970, month=1, day=1, hour=20, tzinfo=utc)
        end_time = datetime.datetime(year=1970, month=1, day=2, hour=3, minute=30, tzinfo=utc)
        is_recurring = False
        start_date = None
        end_date = None
        time_ranges = calculate_search_times(weekdays, start_time, end_time, is_recurring, start_date, end_date)
        
        now = datetime.datetime.now().replace(tzinfo=utc)
        self.assertEqual(len(weekdays), len(time_ranges))
        for (begin, end) in time_ranges:
            self.assertTrue(end > begin)
            self.assertEqual(begin.hour, 20)
            self.assertEqual(begin.minute, 0)
            self.assertEqual(end.hour, 3)
            self.assertEqual(end.minute, 30)
    
    def test_calculate_search_times_recurrence(self):
        weekdays = [0, 2]
        start_time = datetime.datetime(year=1970, month=1, day=1, hour=18, tzinfo=utc)
        end_time = datetime.datetime(year=1970, month=1, day=2, hour=2, tzinfo=utc)
        is_recurring = True
        start_date = datetime.datetime(year=2015, month=3, day=24, tzinfo=utc)
        end_date = datetime.datetime(year=2015, month=4, day=7, tzinfo=utc)
        time_ranges = calculate_search_times(weekdays, start_time, end_time, is_recurring, start_date, end_date)

        self.assertEqual(time_ranges[0][0].month, 3)
        self.assertEqual(time_ranges[0][0].day, 25)
        self.assertEqual(time_ranges[0][0].hour, 18)
        self.assertEqual(time_ranges[0][1].month, 3)
        self.assertEqual(time_ranges[0][1].day, 26)
        self.assertEqual(time_ranges[0][1].hour, 2)
        
        self.assertEqual(time_ranges[1][0].month, 3)
        self.assertEqual(time_ranges[1][0].day, 30)
        self.assertEqual(time_ranges[1][1].month, 3)
        self.assertEqual(time_ranges[1][1].day, 31)
        
        self.assertEqual(time_ranges[2][0].month, 4)
        self.assertEqual(time_ranges[2][0].day, 1)
        self.assertEqual(time_ranges[2][1].month, 4)
        self.assertEqual(time_ranges[2][1].day, 2)
        
        self.assertEqual(time_ranges[3][0].month, 4)
        self.assertEqual(time_ranges[3][0].day, 6)
        self.assertEqual(time_ranges[3][1].month, 4)
        self.assertEqual(time_ranges[3][1].day, 7)
    
    def test_times_overlap(self):
        t0 = datetime.datetime(year=2015, month=3, day=23)
        t1 = datetime.datetime(year=2015, month=3, day=24)
        t2 = datetime.datetime(year=2015, month=3, day=23, hour=10)
        t3 = datetime.datetime(year=2015, month=3, day=24, hour=15)

        self.assertTrue(times_overlap((t0, t1), (t2, t3)))
        self.assertTrue(times_overlap((t2, t3), (t0, t1)))

        t4 = datetime.datetime(year=2015, month=3, day=23)
        t5 = datetime.datetime(year=2015, month=3, day=24)
        t6 = datetime.datetime(year=2015, month=3, day=22)
        t7 = datetime.datetime(year=2015, month=3, day=25)

        self.assertTrue(times_overlap((t4, t5), (t6, t7)))
        self.assertTrue(times_overlap((t6, t7), (t4, t5)))

        t8 = datetime.datetime(year=2015, month=3, day=23)
        t9 = datetime.datetime(year=2015, month=3, day=24)
        t10 = datetime.datetime(year=2015, month=3, day=24)
        t11 = datetime.datetime(year=2015, month=3, day=25)

        self.assertFalse(times_overlap((t8, t9), (t10, t11)))
        self.assertFalse(times_overlap((t10, t11), (t8, t9)))

    def test_find_conflicts(self):
        requesting_user = Account.objects.get(username='alice')
        users = [ Account.objects.get(username=username) for username in ['bob', 'carol'] ]
        begin_time = datetime.datetime(year=2015, month=3, day=23, hour=1, tzinfo=utc)
        end_time = datetime.datetime(year=2015, month=3, day=23, hour=20, tzinfo=utc)
        time_ranges = [ (begin_time, end_time) ]
        is_recurring = False
        
        conflicts = find_conflicts(users, time_ranges, requesting_user, is_recurring)
        
        self.assertEqual(len(conflicts), 3)
        
        self.assertEqual(conflicts[0].user.username, 'bob')
        self.assertEqual(conflicts[0].post.content, 'p2')
        self.assertTrue(conflicts[0].is_conflict)
        
        self.assertEqual(conflicts[1].user.username, 'bob')
        self.assertEqual(conflicts[1].post.content, 'p0')
        self.assertTrue(conflicts[1].is_conflict)
        
        self.assertEqual(conflicts[2].user.username, 'carol')
        self.assertFalse(conflicts[2].is_conflict)
