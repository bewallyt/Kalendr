from rest_framework import viewsets
from rest_framework.response import Response
from signup.models import SignUp, TimeBlock, SignUpSlot
from datetime import datetime, time, date, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
class SignUpCreateView(APIView):

    '''
        Expect data format:
            name: name
            max_duration: max_duration (int)
            min_duration: min_duration (int)
            max_slots: max_slots(int)
            begin_time_list: 'a list
            end_time_list: 'a list

    '''
    def post(self, request):
        name = request.data['content']
        loc = request.date['location']
        begin_time_list = request.data['beginDateTimes']
        end_time_list = request.data['endDateTimes']
        min_duration = request.data['minTimes']
        max_duration = request.data['maxTimes']
        max_slot = request.data['numSlotsPerUser']
        print name
        print type(name)

        print min_duration
        print type(min_duration)

        print max_slot
        print type(max_slot)

        print begin_time_list
        print type(begin_time_list)

        return Response(request.data, status=status.HTTP_200_OK)
