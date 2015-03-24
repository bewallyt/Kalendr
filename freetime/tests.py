from django.test import TestCase
from freetime.serializers import *
from freetime.views import calculate_search_times
import datetime
from django.utils.timezone import utc


class FreeTimeTest(TestCase):
    def setUp(self):
        # Animal.objects.create(name="lion", sound="roar")
        # Animal.objects.create(name="cat", sound="meow")
        return

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
        weekdays = [0, 1, 3, 4]
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
       
    def test_find_conflicts(self):
        return