'''
    This file contains commandline commands for a variety of operations
'''


from posts.models import Post
from groups.models import  KGroup
from authentication.models import Account
from access.models import AccessRule
from signup.models import SignUp, TimeBlock, SignUpSlot
from posts.models import Post
from signup.serializers import SignUpSheetSerializer

sign = SignUp.objects.all()[12]
data = SignUpSheetSerializer(sign)
data.data

user0 = Account.objects.get(username="user0")
user1 = Account.objects.get(username="user1")
user2 = Account.objects.get(username="user2")
user3 = Account.objects.get(username="user3")
user4 = Account.objects.get(username="user4")
user5 = Account.objects.get(username="user5")


# On django model manager: https://docs.djangoproject.com/en/1.7/topics/db/managers/
# django doc on making queries is also helpful:
#           https://docs.djangoproject.com/en/1.7/topics/db/queries/
#
#


'''
    Create and delete a new user
'''
# On cmd, using ac = Account(...param...), username or email are not required. You can provide either one.
# param can't be empty though.

# Method 1
ac = Account(email="user0@admin.com", username="user0");
ac.save();

# Method 2: This method, we have to provide email and username at least.
#           And it seems that password is auto-generated
Account.objects.create_user(email="user0@admin.com", username="user0")

# Delete a user.
ac = Account.objects.all()[1]
ac.delete()




'''
    Find an existing user
'''
>>> ac = Account.objects.get(username="user0")
>>> ac
<Account: user0@admin.com>

# pk: primary key
>>> ac = Account.objects.get(username="user0")
>>> ac
<Account: user0@admin.com>
>>> ac.pk
2
>>> Account.objects.get(pk=2)
<Account: user0@admin.com>

# email is the unqiue account.
>>> Account.objects.get(email="user0@admin.com")
<Account: user0@admin.com>


>>> type(Account.objects.get(email="user0@admin.com"))
<class 'authentication.models.Account'>





'''
    Check if a user exist
'''
>>> Account.objects.filter(email="user0@admin.com")
[<Account: user0@admin.com>]
>>> type(Account.objects.filter(email="user0@admin.com"))
<class 'django.db.models.query.QuerySet'>

>>> Account.objects.filter(email="user0@admin.com").exists()
True




'''
    Change the value of a specific field of a user
'''
>>> ac = Account.objects.get(username = "user0")
>>> ac
<Account: user0@admin.com>
>>> ac.tagline
u''
>>> ac.tagline="user0's tagline"
>>> ac.save()
>>> ac = Account.objects.get(username = "user0")
>>> ac.tagline
u"user0's tagline"

#TODO: just don't do the same thing for password.
# See: https://docs.djangoproject.com/en/1.7/topics/auth/default/#changing-passwords
# The above post listed 2 ways of changing password





'''
    Change the password for an existing user, on the command line
'''
# See: https://docs.djangoproject.com/en/1.7/topics/auth/default/#changing-passwords
# The above post listed 2 ways of changing password



'''
    Iterate through all users
'''
>>> type(Account.objects.all())
<class 'django.db.models.query.QuerySet'>

>>> for user in Account.objects.all():
...     print user.email
...
user0@admin.com
user1@admin.com
user2@admin.com
user3@admin.com
user4@admin.com
user5@admin.com
>>> for user in Account.objects.all():
...     print user.username
...
user0
user1
user2
user3
user4
user5
>>> for user in Account.objects.all():
...     print user.password
...
pbkdf2_sha256$15000$ZATjldcPgDth$zW9n8M76J0fsjOACi+EGzDk938Nz8VTVZWuIc2WvPbI=
pbkdf2_sha256$15000$zmO62W3883oW$p9+xdE0KLhfF4ZlXojXJHNbpbl0yAkUh4gw0aFCY7/s=
pbkdf2_sha256$15000$reHuRwQ77y2t$cZ+67lJB8Zlk7NycZ9ept9ZaQie4Oo1RPTYD7J2rFus=
pbkdf2_sha256$15000$cF1TLGtx64eK$Hjws063eGAyssAQGnOpzV5j0lf37d/GZ1yMScOppjw4=
pbkdf2_sha256$15000$ooxOLOq30Ebh$DksT50Mn622fGbafknlbM6SByD5QwyCGV72aQpNqj2s=
pbkdf2_sha256$15000$qLGcn3bWb3Ts$RWmdnMozt4xMeJZHENoFyRix1YdIyvTwIM98VFal0bU=




'''
    Create a group for a user
'''
#TODO: prevent creating a group with a duplicated name

# .mygroups returns a manager for KGroups class. With it, we can do all operations as if we did:
# KGroup.objects
>>> Account.objects.all()[0].mygroups
<django.db.models.fields.related.RelatedManager object at 0x102783850>

# Because what we acquire through .mygroups is a RelatedManager object. When we do .create, it automatically
# links the created KGroup with the Account by setting the owner ForeignKey field in the KGroup to the Account
>>> Account.objects.all()[0].mygroups.create(name="family")
<KGroup: family>
>>> KGroup.objects.all()
[<KGroup: family>]
>>> KGroup.objects.all()[0].owner
<Account: user0@admin.com>

# Even though the 2 groups that 2 accounts own have the same name, they are only equal
>>> Account.objects.all()[1].mygroups.all()[1]
<KGroup: user2>
>>> Account.objects.all()[0].mygroups.all()[2]
<KGroup: user2>
>>> Account.objects.all()[1].mygroups.all()[1] == Account.objects.all()[0].mygroups.all()[2]
False






'''
    Get all the groups that this user owns
'''
>>> Account.objects.all()[0].mygroups
<django.db.models.fields.related.RelatedManager object at 0x102783850>







'''
    Add other users into groups
'''
>>> Account.objects.all()[0].mygroups.get(name="family").members
<django.db.models.fields.related.ManyRelatedManager object at 0x1027e6c10>

>>> user0 = Account.objects.get(username="user0")
>>> user1 = Account.objects.get(username="user1")
>>> user2 = Account.objects.get(username="user2")
>>> user3 = Account.objects.get(username="user3")
>>> user4 = Account.objects.get(username="user4")
>>> user5 = Account.objects.get(username="user5")
user0 = Account.objects.get(username="user0")
user1 = Account.objects.get(username="user1")
user2 = Account.objects.get(username="user2")
user3 = Account.objects.get(username="user3")
user4 = Account.objects.get(username="user4")
user5 = Account.objects.get(username="user5")



>>> Account.objects.all()[0].mygroups.get(name="family").members.add(user2, user4, user5)
>>> Account.objects.all()[0].mygroups.get(name="family").members.all()
[<Account: user2@admin.com>, <Account: user4@admin.com>, <Account: user5@admin.com>]
>>> type(Account.objects.all()[0].mygroups.get(name="family").members.all())
<class 'django.db.models.query.QuerySet'>



# After doing mygroups.members.add(), we don't need to do .save() for the change to be saved in the DB.




'''
    Create a post/event
'''
>>> user0.myevents
<django.db.models.fields.related.RelatedManager object at 0x1026b8a50>


# I did it through our web interface, because I didn't want to manually modify the date fields, such as create_at,etc.






'''
    Get all the posts that this user owns
'''
>>> user0.myevents.all()

>>> type(user0.myevents.all())
<class 'django.db.models.query.QuerySet'>






'''
    Share a post with a group. Or in other words, create a link through AccessRule
'''
# Example on how to use through field:
# https://docs.djangoproject.com/en/1.7/topics/db/models/#extra-fields-on-many-to-many-relationships

# It seems that the linking is done by creating and saving the through field model objects instead of explicitly
# linking posts and groups.
>>> post1 = user0.myevents.get(content = "post1")
>>> post1
<Post: post1>
>>> user0_groupuser1 = user0.mygroups.get(name="user1")
>>> user0_groupuser1
<KGroup: user1>
>>> user0_groupuser4 = user0.mygroups.get(name="user4")
>>> user0_groupuser4
<KGroup: user4>
>>> ar1 = AccessRule(post=post1,group=user0_groupuser1, visibility='MOD', order=1)
>>> ar1
<AccessRule: post1,user1>
>>> ar1.save()
>>> post1.shared_with
<django.db.models.fields.related.ManyRelatedManager object at 0x102770690>
>>> post1.shared_with.all()
[<KGroup: user1>]
>>> ar2 = AccessRule(post=post1,group=user0_groupuser4, visibility='BUS', order=2)
>>> ar2
<AccessRule: post1,user4>
>>> ar2.save()
>>> post1.shared_with.all()
[<KGroup: user1>, <KGroup: user4>]



# Another example
>>> post2 = user0.myevents.get(content = "post2")
>>> user0_family = user0.mygroups.get(name="family")
>>> user0_groupuser5 = user0.mygroups.get(name="user5")
>>> ar3 = AccessRule(post=post2,group=user0_family, visibility='BUS', order=2)
>>> ar3.save()
>>> ar4 = AccessRule(post=post2,group=user0_groupuser5, visibility='MOD', order=1)
>>> ar4.save()
>>> post2.shared_with.all()
[<KGroup: family>, <KGroup: user5>]


# For repeated events
>>> for apost in post2:
...     i = i+1
...     link = AccessRule(post = apost, group=user1_groupuser5, visibility="MOD", order=i)
...     link.save()
...
>>> post2
[<Post: post2>, <Post: post2>, <Post: post2>, <Post: post2>]
>>> post2[1]
<Post: post2>
>>> post2[1].shared_with
<django.db.models.fields.related.ManyRelatedManager object at 0x102770e10>
>>> post2[1].shared_with.all()
[<KGroup: user5>]



'''
    Get all the groups that I'm a member of
'''
# Use user2 as an example
# KGroup has a M2M field to Account, w/o through field
>>> KGroup.objects.filter(members__username="user2")
[<KGroup: family>, <KGroup: user2>, <KGroup: user2>]

# Get all the groups in which user2 is a member and are owned by user0
>>> KGroup.objects.filter(members__username="user2", owner__username="user0")
[<KGroup: family>, <KGroup: user2>]




'''
    Filter the groups in which I'm the only member
'''
# First of all, this is how we further apply filters onto a queryset:
>>> q = KGroup.objects.filter(members__username="user2")
>>> q;
[<KGroup: family>, <KGroup: user2>, <KGroup: user2>]
>>> type(q)
<class 'django.db.models.query.QuerySet'>
>>> q.filter(owner__username="user0")
[<KGroup: family>, <KGroup: user2>]
>>> q
[<KGroup: family>, <KGroup: user2>, <KGroup: user2>]


>>> type(q[0])
<class 'groups.models.KGroup'>


'''
    Get all follower groups
'''
>>> KGroup.objects.filter(owner__username = "user0", is_follow_group=True)
[<KGroup: user1>, <KGroup: user2>, <KGroup: user3>, <KGroup: user4>, <KGroup: user5>]

'''
    Get all non-follower groups
'''
>>> KGroup.objects.filter(owner__username = "user0", is_follow_group=False)
[<KGroup: family>]


'''
    Get all the posts that are shared with me
'''
>>> Post.objects.filter(shared_with__name="user5")
[<Post: post2>]
>>> Post.objects.filter(shared_with__name="user5", shared_with__is_follow_group = True)
[<Post: post2>]
>>> Post.objects.filter(shared_with__name="user5", shared_with__is_follow_group = False)
[]




'''
    Get all the posts that are shared with me that I haven't reply to yet
'''
>>> Post.objects.filter(shared_with__name="user5", shared_with__is_follow_group = True, accessrule__receiver_response='NO_RESP')
[<Post: post2>]





'''
    Serialization: from model object to JSON
'''
serializer = PostSerializer(post)
serializer.data # this contents Python native datatype, e.g. a list. For serialization, this is an intermediate step

# Then with the Python native datatype, we can render it into JSON string.
content = JSONRenderer().render(serializer.data)
content

# We can also serialize querysets instead of model instances.
# To do so we simply add a many=True flag to the serializer arguments.
'''
    Deserialization: from JSON to model object
'''
#  Frist parse stream into Python native datatypes
stream = BytesIO(content)
data = JSONParser().parse(stream)

# Then we can use our serializer to create django model instance(s) from the JSON
serializer = SnippetSerializer(data=data)
serializer.is_valid()
# True
serializer.validated_data # this contains Python native datatypes
# OrderedDict([('title', ''), ('code', 'print "hello, world"\n'), ('linenos', False), ('language', 'python'), ('style', 'friendly')])
serializer.save()
# <Snippet: Snippet object>

    '''
        Deserialization with Request
    '''
    instance = serializer(request.data)
    if serializer.is_valid:
        serializer.save(author=self.request.user)



'''
    Get through field (i.e., AccessRule for a post)
'''

>>> post.accessrule_set
<django.db.models.fields.related.RelatedManager object at 0x1026ebf10>
>>> post.accessrule_set.all()
[<AccessRule: sharing test,user2>, <AccessRule: sharing test,family>, <AccessRule: sharing test,user4>, <AccessRule: sharing test,user5>]
>>> post.accessrule_set.all()[0].visibility
u'MOD'
>>> post.accessrule_set.all()[1].visibility
u'BUS'
>>> post.accessrule_set.all()[2].visibility
u'BUS'
>>> post.accessrule_set.all()[3].visibility
u'BUS'
>>> post.accessrule_set.all()[4].visibility



>>> post = user0.myevents.filter(shared_with__name="user5")
>>> post
[<Post: post2>, <Post: gs>, <Post: sharing test>, <Post: sharing test2>]
>>> post.exclude(accessrule__receiver_response='NO_RESP')
[]


'''
    Get all the groups that a post is shared with
'''
>>> post.shared_with.all()
[<KGroup: user2>, <KGroup: family>, <KGroup: user4>, <KGroup: user5>]


'''
    For a specific post and a specific user, get the AccessRule between them
'''
>>> post
<Post: sharing test>
>>> AccessRule.objects.get(post = post, group__name=user4.username)
<AccessRule: sharing test,user4>
# if i have the post and user instance


'''

'''
>>> posts.filter(shared_with__name = "user4")
[<Post: gs>, <Post: sharing test>, <Post: asdf>]
>>> posts.filter(shared_with__name = "user4", shared_with__is_follow_group=True)
[<Post: gs>, <Post: sharing test>, <Post: asdf>]
>>> posts.filter(shared_with__name = "user4", shared_with__is_follow_group=False)
[]

# this shows that post.filter(shared_with__) is accessing the field of a KGroup.

'''
    Get all the follower groups that a post is shared with. And get all the AccessRules
'''
>>> post.shared_with.all()
[<KGroup: user5>, <KGroup: user1>]
>>> post.accessrule_set.all()
[<AccessRule: sharing test2,user5>, <AccessRule: sharing test2,user1>]
