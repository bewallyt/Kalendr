from django.db import models
from posts.models import Post
from groups.models import KGroup

class AccessRule(models.Model):
    post = models.ForeignKey(Post, blank=True)
    group = models.ForeignKey(KGroup, blank=True)
    VISIBILITY_CHOICES = (
        ('BUS', 'Busy Only'),
        ('ALL', 'All'),
        ('MOD', 'Modify'),
    )
    visibility = models.CharField(max_length=3, choices=VISIBILITY_CHOICES)
    order = models.PositiveIntegerField()

    RESPONSE_CHOICES = (
        ('CONFIRM', 'Confirm'),
        ('DECLINE', 'Decline'),
        ('REMOVED', 'Removed'),
        ('NO_RESP', 'No response'),
    )

    # receiver_response is set to NO_RESP when an AccessRule is created/ when an event is shared.
    # NO_RESP requires the receiver of the event to respond to the creation request.
    # receiver_response needs to be set to NO_RESP when ever the owner of the event modifies the
    # specs of the event
    receiver_response = models.CharField(max_length=7, choices=RESPONSE_CHOICES, default='NO_RESP')

    # If just setting the precedence, the owner of the event may not want whoever the event is shared with to
    # get a notification of the sharing.
    # But the current implementation is that we notify whoever we shared with whenever we share
    notify_receiver = models.BooleanField(default=True)


    # When a receiver of the event modifies it, this field should be
    notify_owner = models.BooleanField(default=False)

    # The receiver of the post can set notification for this event that is shared with her/him
    notification_email = models.BooleanField(default=False)


    def __unicode__(self):
        return '{0},{1}'.format(self.post.content, self.group.name)