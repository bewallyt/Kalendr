'''
    This file contains commandline commands for a variety of operations
'''


from posts.models import Post
from groups.models import  KGroup
from authentication.models import Account
from access.models import AccessRule


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


>>> user1 = Account.objects.get(username="user1")
>>> user2 = Account.objects.get(username="user2")
>>> user3 = Account.objects.get(username="user3")
>>> user4 = Account.objects.get(username="user4")
>>> user5 = Account.objects.get(username="user5")

>>> Account.objects.all()[0].mygroups.get(name="family").members.add(user2, user4, user5)
>>> Account.objects.all()[0].mygroups.get(name="family").members.all()
[<Account: user2@admin.com>, <Account: user4@admin.com>, <Account: user5@admin.com>]
>>> type(Account.objects.all()[0].mygroups.get(name="family").members.all())
<class 'django.db.models.query.QuerySet'>







'''
    Create a post
'''





'''
    Get all the posts that this user owns
'''


'''
    Share a post with a group. Or in other words, create a link through AccessRule
'''



'''
    Get all the groups that I'm a member of
'''


'''
    Filter the groups in which I'm the only member
'''



'''
    Get all the posts that are shared with me
'''
