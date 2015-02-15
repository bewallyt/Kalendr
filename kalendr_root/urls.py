from django.conf.urls import patterns, url, include

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView
from posts.views import AccountPostsViewSet, PostViewSet
from kalendr_root.views import IndexView
from groups.views import GroupViewSet, AccountGroupsViewSet

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'posts', PostViewSet)
router.register(r'groups', GroupViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
accounts_router.register(r'posts', AccountPostsViewSet)
accounts_router.register(r'groups', AccountGroupsViewSet)

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