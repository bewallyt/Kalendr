from rest_framework import viewsets
from rest_framework.response import Response
from signup.models import SignUp, TimeBlock, SignUpSlot
from datetime import datetime, time, date, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from signup.serializers import SignUpSheetSerializer


# Create your views here.
class SignUpCreateView(viewsets.ModelViewSet):
    serializer_class = SignUpSheetSerializer
    queryset = SignUp.objects.all()

    '''
        Expect data format:
            name: name
            max_duration: max_duration (int)
            min_duration: min_duration (int)
            max_slots: max_slots(int)
            begin_time_list: 'a list
            end_time_list: 'a list

    '''
    def create(self, request):
        print 'In Signup Create'
        print request.data

        name = request.data['content']
        print name
        print type(name)

        max_slot = request.data['numSlotsPerUser']
        print max_slot
        print type(max_slot)
        min_duration = request.data['minTimes']
        print min_duration
        print type(min_duration)

        loc = request.data['location']
        begin_time_list = request.data['beginDateTimes']
        print begin_time_list
        print type(begin_time_list)
        end_time_list = request.data['endDateTimes']



        max_duration = request.data['maxTimes']









        return Response(request.data, status=status.HTTP_200_OK)
