from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from schedule.models import ScheduleRequest
from schedule.serializers import ScheduleRequestSerializer
from posts.models import Post

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = ScheduleRequest.objects.all()
    serializer_class = ScheduleRequestSerializer

    '''
    Expecting:
    {
        format: {0, 1} #0 if plain_text, 1 if graphical
        start_date: datetime
        end_date: datetime
    }
    '''
    def create(self, request):
        # validate data, but don't store in db
        request_serializer = ScheduleRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        validated_data = request_serializer.validated_data

        # unpack input
        graphical = validated_data['format'] == 1
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        user = request.user
        email_address = user.email

        # do stuff
        ## get all posts authored by user and all posts user has confirmed, filtering between provided dates
        ## check, does this include blocks signed up for
        ## write methods in mail.py for sending plain_text/graphical posts
        ## success/failure of mail sending should be returned from those methods for the Response        
       
        # return response
        return Response(data = '', status=status.HTTP_200_OK)