from django.test import TestCase
#from rest_framework.test import APITestCase
#from rest_framework.test import APIRequestFactory
from freetime.serializers import *


class FreeTimeTest(TestCase):
    def setUp(self):
        # Animal.objects.create(name="lion", sound="roar")
        # Animal.objects.create(name="cat", sound="meow")
        return

    def test_make_request(self):
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
        #request_data = APIRequestFactory().get('/freetime/', data, format='json')

        serializer = FreeTimeRequestSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        request = serializer.save()
        print request.event_type
        print request.start_date
        print request.end_date
        print request.start_time
        print request.end_time
        print request.duration_hrs
        print request.duration_min

    # def test_animals_can_speak(self):
    #     """Animals that can speak are correctly identified"""
    #     lion = Animal.objects.get(name="lion")
    #     cat = Animal.objects.get(name="cat")
    #     self.assertEqual(lion.speak(), 'The lion says "roar"')
    #     self.assertEqual(cat.speak(), 'The cat says "meow"')