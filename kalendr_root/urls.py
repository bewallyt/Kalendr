from django.conf.urls import patterns, url, include

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView
from posts.views import AccountPostsViewSet, PostViewSet, NotificationPostView, GetSharedPostView, PostUpdateView, \
    AccountUpdatePudPostViewSet, AccountSavePudPostViewSet
from kalendr_root.views import IndexView
from groups.views import GroupViewSet, AccountGroupsViewSet, AccountFollowingViewSet, AccountFollowerGroupsViewSet, \
    AccountNonFollowerGroupsViewSet, AccountSpecificGroupViewSet, AccountLatestGroupViewSet, \
    AccountFollowingPersonViewSet, AccountFollowingGroupViewSet

from access.views import AccessViewSet, AccountAccessViewSet, NotificationResponseView,PartialUpdateView
from puds.views import AccountPudsViewSet, PudViewSet, AccountCompletePudViewSet
from freetime.views import FreeTimeViewSet
from signup.views import SignUpCreateAndListView, SignUpView

# Base router
router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'posts', PostViewSet)
router.register(r'groups', GroupViewSet)
# This initially gives base_name not specified error. But added serializer in PartialUpdateViewSet fixed the
# problem
# This is for updating an AccessRule instance. Partial update.
router.register(r'access', AccessViewSet)
router.register(r'access_update', PartialUpdateView)
router.register(r'puds', PudViewSet)
router.register(r'notification_posts', NotificationPostView)
router.register(r'notification_response', NotificationResponseView)
router.register(r'post_update', PostUpdateView)
router.register(r'freetime', FreeTimeViewSet)
# Initially used APIView. Didn't make it to make, keep getting 405. Switched to
# ModelViewSet and worked at once. Experience: 
router.register(r'signup', SignUpCreateAndListView)

# For return description of a specific signup post
signup_router = routers.NestedSimpleRouter(router, r'signup', lookup='post')
signup_router.register(r'get_description', SignUpCreateAndListView)
signup_router.register(r'request', SignUpView)

# For other users to select signup slots
select_slot_router = routers.NestedSimpleRouter(signup_router, r'get_description', lookup='duration')
select_slot_router.register(r'request', SignUpView)


accounts_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')
# /api/v1/accounts/"user_id/name"/posts/
accounts_router.register(r'posts', AccountPostsViewSet)
# all the groups that I own
accounts_router.register(r'groups', AccountGroupsViewSet)
# all the follower groups that I own
accounts_router.register(r'myfollowergroups', AccountFollowerGroupsViewSet)
# all the non-follower groups that I own
accounts_router.register(r'mynonfollowergroups', AccountNonFollowerGroupsViewSet)
# all the non-follower groups that I;m a member of
accounts_router.register(r'mymembergroups', AccountFollowingGroupViewSet)
# all non-groups im following
accounts_router.register(r'following', AccountFollowingPersonViewSet)
# all posts shared with me
accounts_router.register(r'access', AccountAccessViewSet)
accounts_router.register(r'puds', AccountPudsViewSet)
# all the groups that I'm a member of and do not own
accounts_router.register(r'following_all', AccountFollowingViewSet)
accounts_router.register(r'specific_group', AccountSpecificGroupViewSet)
accounts_router.register(r'latest_group', AccountLatestGroupViewSet)
# API endpoint for getting posts that a user shared with me
# /api/v1/accounts/"owner_name"/get_shared/
accounts_router.register(r'get_shared', GetSharedPostView)

week_router = routers.NestedSimpleRouter(accounts_router, r'posts', lookup='post')

# api/v1/accounts/"user_name/id"/posts/"post_id|week_num"/week/
week_router.register(r'week', AccountPostsViewSet)
week_router.register(r'savePostPud', AccountPostsViewSet)
week_router.register(r'updatePostPud', AccountUpdatePudPostViewSet)

save_router = routers.NestedSimpleRouter(week_router, r'savePostPud', lookup='week')
save_router.register(r'pudContent', AccountSavePudPostViewSet)

pud_save_router = routers.NestedSimpleRouter(accounts_router, r'puds', lookup='pud')
pud_save_router.register(r'savePud', AccountPudsViewSet)

pud_complete_router = routers.NestedSimpleRouter(pud_save_router, r'savePud', lookup='complete')
pud_complete_router.register(r'pudComplete', AccountCompletePudViewSet)

group_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')
group_router.register(r'groups', AccountGroupsViewSet)


# /api/v1/notification_response/"post"/response/
notification_router = routers.NestedSimpleRouter(router, r'notification_response', lookup='post')
notification_router.register(r'response', NotificationResponseView)

notification_response_router = routers.NestedSimpleRouter(notification_router, r'response', lookup='res')
notification_response_router.register(r'list', NotificationResponseView)

urlpatterns = patterns(
    '',

    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/', include(group_router.urls)),
    url(r'^api/v1/', include(week_router.urls)),
    url(r'^api/v1/', include(save_router.urls)),
    url(r'^api/v1/', include(signup_router.urls)),
    url(r'^api/v1/', include(select_slot_router.urls)),
    url(r'^api/v1/', include(pud_save_router.urls)),
    url(r'^api/v1/', include(pud_complete_router.urls)),
    url(r'^api/v1/', include(notification_router.urls)),
    url(r'^api/v1/', include(notification_response_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^.*$', IndexView.as_view(), name='index'),
)