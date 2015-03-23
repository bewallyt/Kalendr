from django.test import TestCase
from freetime.serializers import *


class FreeTimeTest(TestCase):
    def setUp(self):
        # Animal.objects.create(name="lion", sound="roar")
        # Animal.objects.create(name="cat", sound="meow")
        return

    # def test_animals_can_speak(self):
    #     """Animals that can speak are correctly identified"""
    #     lion = Animal.objects.get(name="lion")
    #     cat = Animal.objects.get(name="cat")
    #     self.assertEqual(lion.speak(), 'The lion says "roar"')
    #     self.assertEqual(cat.speak(), 'The cat says "meow"')

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

    def test_calculate_search_times(self):
        return

    def test_find_conflicts(self):
        return