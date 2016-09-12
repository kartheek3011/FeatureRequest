from django.conf.urls import url
from features import views

urlpatterns = [
	url(r'^features/$', views.features, name='features'),
	url(r'^feature/(?P<feature_id>\d+)\?$', views.feature, name='feature'),
	url(r'^feature/create$', views.create_feature, name='create_feature'),
	url(r'^comment/add', views.add_comment, name='add_comment')
]