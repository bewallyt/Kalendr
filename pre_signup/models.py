from django.db import models
from authentication.models import Account
from django.db import models
from posts.models import Post
from datetime import timedelta


class PrefSignUpManager(models.Manager):
    def create_signup(self, post, name, location, duration,
                      begin_time_list, end_time_list):

        if len(begin_time_list) != len(end_time_list):
            raise ValueError('Begin time list and end time list do not match')

        sheet = self.model(post = post, name = name, location = location,
                           duration = duration)

        sheet.save()
        min_delta = timedelta(minutes = duration)


        for i in range(0,len(begin_time_list)):
            begin_time = begin_time_list[i]
            end_time = end_time_list[i]
            PrefTimeBlock.objects.create_timeblock(sheet, begin_time, end_time, min_delta)


        return sheet



'''
    Best Field to represent time? The operations that we will do with minimum duration:
        1. Add minimum duration to staring time
    Options:
        1. TimeField: represented in Python by a datetime.time instance
        2. DateTimeField: represented in Python by a datetime.datetime instance
    Doc on datetime:
        https://docs.python.org/2/library/datetime.html

    Seems that the best class to represent the maximum and minimum duration is datetime.time.
    What's the corresponding Django model field? TimeField.
    Could we diff two datetime.datetime and get a datetime.time?

    Actually, let's use integer field. Because for any time comparison and arthimetic,
    datetime.timedelta is the easiest. But Django does not have a good field to store
    datetime.timedelta, so it would be created on the fly. Also, there is no easy way
    to convert a datetime.time to datetime.timedelta.

    Assumption: the unit for max/min_duration is minute.
    '''
class PrefSignUp(models.Model):
    # Make sure this OnetoOne field can be empty. i.e., A post doesn't have to have a O2O
    # field defined to a SignUp object. And
    post = models.OneToOneField(Post, primary_key=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    duration = models.IntegerField(default=120)
    resolved = models.BooleanField(default=False, blank=False)

    objects = PrefSignUpManager()

    # How to add a list of things? e.g. A list of blocks? Manytomany field? or an actual list
    # We're gonna use ForeignKey. Just like Posts and User

class PrefTimeBlockManage(models.Manager):
    def create_timeblock(self, sheet, begin_time, end_time, delta):
        # What would happen if the back end raises exception? Server crash? Would Frontend get
        # any results back?
        if end_time < begin_time:
            raise ValueError('Block end time is earier than begin time')

        time_block = self.model(sheet = sheet, start_time = begin_time, end_time = end_time)
        time_block.save()


        time = begin_time
        while time + delta <= end_time:
            slot_begin = time
            slot_end = time + delta
            slot = PrefSignUpSlot(block = time_block, start_time = slot_begin, end_time = slot_end)
            slot.save()
            time = slot_end


class PrefTimeBlock(models.Model):
    sheet = models.ForeignKey(PrefSignUp, related_name="myblocks", blank=True)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null = True)
    end_time = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null = True)

    objects = PrefTimeBlockManage()




class PrefSignUpSlot(models.Model):

    block = models.ForeignKey(PrefTimeBlock, related_name="myslots", blank=True)
    # The list users who chose this slot as prefered. Example: Post to KGroup
    # shared_with = models.ManyToManyField(KGroup, blank=True, through='access.AccessRule')
    requester_list = models.ManyToManyField(Account, related_name="requester_list", through='SignUpPreference',
                                           blank=True, null=True)

    # owner is None until originator tries to resolve the schedule.
    owner = models.ForeignKey(Account, related_name='resolved_owner', blank=True, null=True)

    start_time = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null = True)
    end_time = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null = True)

'''
    Whenever a requestor chooses a slot, an instance of SignUpPref is created.
    This is the through field used in the requtor_list in PreSignUpSlot
'''
class SignUpPreference(models.Model):
    slot = models.ForeignKey(PrefSignUpSlot, blank=True)
    requester = models.ForeignKey(Account, blank=True)
    # 3 = Strongly prefer; 2 = Slightly prefer; 1 = If I have to; 0 = not selected
    pref = models.PositiveSmallIntegerField()