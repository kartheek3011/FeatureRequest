from django.conf.urls import url
from users import views


urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^check_user/$', views.check_user, name='check_user'),
    url(r'^email_verification_msg/$', views.email_verification_msg, name='email_verification_msg'),
    url(r'^confirm_email/$', views.confirm_email, name='confirm_email'),
    url(r'^login/?$', views.login_user, name='login'),
    url(r'^forgot_password/?$', views.forgot_password, name='forgot_password'),
    url(r'^reset_password/$', views.reset_password, name='reset_password'),

	url(r'^profile/$', views.profile, name='profile'),	
	url(r'^logout/?$', views.logout_user, name='logout'),

	url(r'^client/create_account/?$', views.client_create_account, name='client_create_account'),		
	url(r'^team_member/create_account/?$', views.team_member_create_account, name='team_member_create_account'),    
]
