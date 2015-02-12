from django.conf.urls import patterns, url

from kalendr_root.views import IndexView

urlpatterns = patterns(
    '',

    url('^.*$', IndexView.as_view(), name='index'),
)