from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from schedule.models import ScheduleRequest
from schedule.serializers import ScheduleRequestSerializer
from posts.models import Post
from access.models import AccessRule
from django.utils.timezone import now
from datetime import timedelta
from mail import mail


'''
Returns a list of all posts authored by the user, and all shared posts that the user has confirmed,
provided that those posts are within the time range
'''
def search_posts(user, start_date, end_date):
    authored_posts = user.myevents.filter(start_time__gte=start_date).filter(start_time__lte=end_date)
    confirmed_posts = Post.objects.filter(start_time__gte=start_date).filter(start_time__lte=end_date).filter(shared_with__name=user.username, accessrule__receiver_response='CONFIRM')
    
    for post in confirmed_posts:
        ac = AccessRule.objects.get(post=post, group__name=user.username)
        if ac.visibility == 'BUS':
            post.content = 'Busy'
            post.location_event = ''
            post.description_event = ''
    
    return sorted(authored_posts | confirmed_posts, cmp=lambda x,y: cmp(x.start_time, y.start_time) if cmp(x.start_time, y.start_time) != 0 else cmp(x.begin_time, y.begin_time))
    

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
        if start_date == None:
            start_date = now()
        if end_date == None:
            end_date = start_date + timedelta(weeks=1)
        user = request.user
        email_address = user.email
        
        # do stuff
        posts = search_posts(user, start_date, end_date)
        if graphical:
            response_data = mail.send_graphical_schedule(posts, start_date, end_date, email_address)
        else:
            response_data = mail.send_text_schedule(posts, start_date, end_date, email_address)
       
        # return response
        if response_data.get('status') == 'sent' or response_data.get('status') == 'queued':
            status_code = status.HTTP_200_OK
        else:
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return Response(data = response_data, status=status_code)