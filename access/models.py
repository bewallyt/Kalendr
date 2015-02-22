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

    def __unicode__(self):
        return '{0},{1}'.format(self.post.content, self.group.name)