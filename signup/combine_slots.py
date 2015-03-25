from posts.models import Post
from signup.models import SignUp, SignUpSlot, TimeBlock
from posts.serializers import PostSerializer
from signup.serializers import SignUpSheetSerializer,SignUpSlotSerializer, TimeBlockSerializer

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

        for i in range(0,len(slot_list),num_slots_to_combine):
            new_owner = None
            upper = min(len(slot_list), i + num_slots_to_combine)
            for j in range(i, upper):

                if (slot_list[j].owner == None) or (slot_list[j].owner == requester):
                    print 'Available slot'
                else:
                    print 'Slot taken by: ' + slot_list[j].owner.username
                    new_owner = slot_list[j].owner

            new_slot = SignUpSlot(owner = new_owner, block = new_block, start_time = slot_list[i].start_time, end_time = slot_list[i+num_slots_to_combine-1].end_time)
            new_slot.save()

    data = SignUpSheetSerializer(new_sign)

    print data.data
    new_sign.delete()
    new_post.delete()
    return data.data