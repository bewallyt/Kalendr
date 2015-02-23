from django.conf.urls import patterns, url, include

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView
from posts.views import AccountPostsViewSet, PostViewSet
from kalendr_root.views import IndexView
from groups.views import GroupViewSet, AccountGroupsViewSet, AccountFollowingViewSet, AccountFollowerGroupsViewSet, \
    AccountNonFollowerGroupsViewSet, AccountSpecificGroupViewSet, AccountLatestGroupViewSet, \
    AccountFollowingPersonViewSet, AccountFollowingGroupViewSet

from access.views import AccessViewSet, AccountAccessViewSet
from puds.views import AccountPudsViewSet, PudViewSet

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'posts', PostViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'access', AccessViewSet)
router.register(r'puds', PudViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
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

accounts_router.register(r'access', AccountAccessViewSet)
accounts_router.register(r'puds', AccountPudsViewSet)
# all the groups that I'm a member of and do not own
accounts_router.register(r'following_all', AccountFollowingViewSet)
accounts_router.register(r'specific_group', AccountSpecificGroupViewSet)
accounts_router.register(r'latest_group', AccountLatestGroupViewSet)

week_router = routers.NestedSimpleRouter(
    accounts_router, r'posts', lookup='post'
)
week_router.register(r'week', AccountPostsViewSet)

group_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
group_router.register(r'groups', AccountGroupsViewSet)

urlpatterns = patterns(
    '',

    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/', include(group_router.urls)),
    url(r'^api/v1/', include(week_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^.*$', IndexView.as_view(), name='index'),
)