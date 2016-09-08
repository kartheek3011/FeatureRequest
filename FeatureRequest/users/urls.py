from django.conf.urls import url

from users import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^create_account$', views.create_account, name='create_account'),
    url(r'^check_user/$', views.check_user, name='check_user'),
    url(r'^email_verification_msg/$', views.email_verification_msg, name='email_verification_msg'),
    url(r'^confirm_email/$', views.confirm_email, name='confirm_email'),
    url(r'^login/?$', views.login_user, name='login'),
    url(r'^forgot_password/?$', views.forgot_password, name='forgot_password'),
    url(r'^reset_password/$', views.reset_password, name='reset_password'),


	url(r'^profile/$', views.profile, name='profile'),
	url(r'^profile/edit$', views.edit_profile, name='edit_profile'),	
	url(r'^logout/?$', views.logout_user, name='logout'),
    
]
