from django.conf.urls import patterns, url, include

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView
from posts.views import AccountPostsViewSet, PostViewSet, AccountSavePudPostViewSet, AccountUpdatePudPostViewSet
from kalendr_root.views import IndexView
from groups.views import GroupViewSet, AccountGroupsViewSet, AccountFollowingViewSet, AccountSpecificGroupViewSet
from access.views import AccessViewSet, AccountAccessViewSet
from puds.views import AccountPudsViewSet, PudViewSet, AccountCompletePudViewSet

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'posts', PostViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'access', AccessViewSet)
router.register(r'puds', PudViewSet)

accounts_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')
accounts_router.register(r'posts', AccountPostsViewSet)
accounts_router.register(r'groups', AccountGroupsViewSet)
accounts_router.register(r'access', AccountAccessViewSet)
accounts_router.register(r'puds', AccountPudsViewSet)
accounts_router.register(r'following', AccountFollowingViewSet)
accounts_router.register(r'specific_group', AccountSpecificGroupViewSet)

week_router = routers.NestedSimpleRouter(accounts_router, r'posts', lookup='post')
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

urlpatterns = patterns(
    '',

    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/', include(group_router.urls)),
    url(r'^api/v1/', include(week_router.urls)),
    url(r'^api/v1/', include(save_router.urls)),
    url(r'^api/v1/', include(pud_save_router.urls)),
    url(r'^api/v1/', include(pud_complete_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^.*$', IndexView.as_view(), name='index'),
)