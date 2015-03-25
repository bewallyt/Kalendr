from posts.models import Post
from signup.models import SignUp, SignUpSlot, TimeBlock
from posts.serializers import PostSerializer
from signup.serializers import SignUpSheetSerializer,SignUpSlotSerializer, TimeBlockSerializer

def combine(post, signup, num_slots_to_combine):
    print post.content
    print signup.name
    print num_slots_to_combine

    timeblock_list = signup.myblocks.all()
    new_sign = SignUp(post = post, name = signup.name, location = signup.location,
                      max_slots = signup.max_slots, max_duration = signup.max_duration,
                      min_duration = signup.min_duration)

    for block in timeblock_list:
        new_block = TimeBlock(sheet = new_sign, start_time= block.start_time, end_time = block.end_time)
        slot_list = block.myslots.all()
        for i in range(0,len(slot_list),num_slots_to_combine):
            for j in range(i,num_slots_to_combine):
                if slot_list[j].owner is None:
                    print 'Available slot'
                else:
                    print 'Slot taken by: ' + slot_list[j].owner.username
                    new_owner = slot_list[j].owner
                    break
            new_slot = SignUpSlot(owner = new_owner, block = new_block, start_time = slot_list[i].start_time, end_time = slot_list[i+num_slots_to_combine-1])

    data = SignUpSheetSerializer(new_sign)
    return data.data