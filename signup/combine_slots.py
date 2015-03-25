from posts.models import Post
from signup.models import SignUp, SignUpSlot, TimeBlock
from posts.serializers import PostSerializer
from signup.serializers import SignUpSheetSerializer,SignUpSlotSerializer, TimeBlockSerializer
from datetime import datetime

def combine(requester, post, signup, num_slots_to_combine):

    timeblock_list = signup.myblocks.all()
    new_post = Post(author = requester, content = post.content)
    new_post.save()
    new_sign = SignUp(post = new_post, name = signup.name, location = signup.location,
                      max_slots = signup.max_slots, max_duration = signup.max_duration,
                      min_duration = signup.min_duration)
    new_sign.save()

    for block in timeblock_list:
        new_block = TimeBlock(sheet = new_sign, start_time= block.start_time, end_time = block.end_time)
        new_block.save()
        slot_list = block.myslots.all()

        i = 0
        j = i + num_slots_to_combine

        while j <= len(slot_list):
            new_owner = None
            for index in range(i,j):
                if (slot_list[index].owner == None) or (slot_list[index].owner == requester):
                    print 'Available slot'
                else:
                    print 'Slot taken by: ' + slot_list[index].owner.username
                    new_owner = slot_list[index].owner

            new_slot = SignUpSlot(owner = new_owner, block = new_block,
                                  start_time = slot_list[i].start_time, end_time = slot_list[j - 1].end_time)
            if new_owner == None:
                new_slot.save()
            i = i + 1
            j = j + 1


    data = SignUpSheetSerializer(new_sign, context={'is_owner': False, 'requester': requester.username})

    print data.data
    new_sign.delete()
    new_post.delete()
    return data.data

def unicode_to_datetime(code):
    datetime_obj = datetime.strptime(code, '%Y-%m-%dT%H:%M:%S.%fZ')
    return datetime_obj
