'''
    Model for sign up sheet implementation.
    One sign up sheet object has the following attributes:
        1. Name
        2. A list of blocks
        3. Minimum and Maximum Duration
        4. Maximum Number of slots that other users can sign up for

    Each block:
        1. Data
        2. Starting and ending time
        3. A list of slots (calculated and created at the point when the block is created.)

    Slot:
        1. Starting and ending time.
        2. User name of the user who signed up.

    Example of one to one relation:
        https://docs.djangoproject.com/en/1.7/topics/db/examples/one_to_one/
        https://docs.djangoproject.com/en/1.7/ref/models/fields/#ref-onetoone
'''
from django.db import models
from posts.models import Post
from authentication.models import Account
from datetime import timedelta, datetime, time, date

'''
    Customized Manager class for SignUp objects/models
    Similar to authentication/AccountManager
    Manager methods can access self.model to get the model class to which they're attached.
'''
class SignUpManager(models.Manager):
    def create_signup(self, post, name, location, max_duration, min_duration, max_slots_per_user,
                      begin_time_list, end_time_list):
        if max_duration < min_duration:
            raise ValueError('Max duration is smaller than min duration.')

        if len(begin_time_list) != len(end_time_list):
            raise ValueError('Begin time list and end time list do not match')

        sheet = self.model(post = post, name = name, location = location,
                           max_duration = max_duration,
                           min_duration = min_duration,
                           max_slots = max_slots_per_user)
        sheet.save()

        min_delta = timedelta(minutes = min_duration)


        for i in range(0,len(begin_time_list)):
            begin_time = begin_time_list[i]
            end_time = end_time_list[i]
            TimeBlock.objects.create_timeblock(sheet, begin_time, end_time, min_delta)


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
class SignUp(models.Model):
    # Make sure this OnetoOne field can be empty. i.e., A post doesn't have to have a O2O
    # field defined to a SignUp object. And
    post = models.OneToOneField(Post, primary_key=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    max_slots = models.IntegerField()

    max_duration = models.IntegerField(default=120)
    min_duration = models.IntegerField(default=0)

    objects = SignUpManager()

    # How to add a list of things? e.g. A list of blocks? Manytomany field? or an actual list
    # We're gonna use ForeignKey. Just like Posts and User

class TimeBlockManage(models.Manager):
    def create_timeblock(self, sheet, begin_time, end_time, delta):
        # What would happen if the back end raises exception? Server crash? Would Frontend get
        # any results back?
        if end_time < begin_time:
            raise ValueError('Block end time is earier than begin time')
        if (end_time - begin_time) < delta:
            raise ValueError('Time difference between begin and end time is smaller than min time delta.')

        time_block = self.model(sheet = sheet, start_time = begin_time, end_time = end_time)
        time_block.save()


        time = begin_time
        while time + delta <= end_time:
            slot_begin = time
            slot_end = time + delta
            slot = SignUpSlot(block = time_block, start_time = slot_begin, end_time = slot_end)
            slot.save()
            time = slot_end



class TimeBlock(models.Model):
    sheet = models.ForeignKey(SignUp, related_name="myblocks", blank=True)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null = True)
    end_time = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null = True)

    objects = TimeBlockManage()


class SignUpSlot(models.Model):
    block = models.ForeignKey(TimeBlock, related_name="myslots", blank=True)
    # Ideally it should be a link to the user object. However, not sure
    # how to break a ForeignKey. Do I just set it to None? Can I check it to be none?
    owner = models.ForeignKey(Account, related_name="signedup", blank=True, null=True)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null = True)
    end_time = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null = True)