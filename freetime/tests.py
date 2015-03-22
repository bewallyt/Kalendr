from django.test import TestCase
#from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from freetime.models import *
from freetime.serializers import *


class FreeTimeTest(TestCase):
    def setUp(self):
        # Animal.objects.create(name="lion", sound="roar")
        # Animal.objects.create(name="cat", sound="meow")
        return

    def test_make_request(self):
        data = \
            {
                'users':
                    [
                        {'username': 'alice'},
                        {'username': 'bob'}
                    ],
                'is_recurring': False,
                'days': [0, 1, 2],
                'start_time': '21:48:22.371000',
                'end_time': '21:50:00.000000',
                'duration': 60
            }
        #request_data = APIRequestFactory().get('/freetime/', data, format='json')

        serializer = FreeTimeRequestSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        request = serializer.save()
        print request.duration
        print request.start_time
        print request.end_time
        print request.is_recurring
        print request.end_date

    # def test_animals_can_speak(self):
    #     """Animals that can speak are correctly identified"""
    #     lion = Animal.objects.get(name="lion")
    #     cat = Animal.objects.get(name="cat")
    #     self.assertEqual(lion.speak(), 'The lion says "roar"')
    #     self.assertEqual(cat.speak(), 'The cat says "meow"')