from django.conf.urls import patterns, url, include

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView
from posts.views import AccountPostsViewSet, PostViewSet
from kalendr_root.views import IndexView
from groups.views import GroupViewSet, AccountGroupsViewSet, AccountFollowingViewSet, AccountFollowerGroupsViewSet, \
    AccountNonFollowerGroupsViewSet, AccountSpecificGroupViewSet

from access.views import AccessViewSet, AccountAccessViewSet
from puds.views import AccountPudsViewSet, PudViewSet

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'ModelViewSet', PostViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'access', AccessViewSet)
router.register(r'puds', PudViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
accounts_router.register(r'posts', AccountPostsViewSet)
accounts_router.register(r'groups', AccountGroupsViewSet)
accounts_router.register(r'myfollowergroups', AccountFollowerGroupsViewSet)
accounts_router.register(r'mynonfollowergroups', AccountNonFollowerGroupsViewSet)

accounts_router.register(r'access', AccountAccessViewSet)
accounts_router.register(r'puds', AccountPudsViewSet)
accounts_router.register(r'following', AccountFollowingViewSet)
accounts_router.register(r'specific_group', AccountSpecificGroupViewSet)

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