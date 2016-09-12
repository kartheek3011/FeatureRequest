#std imports python
#Core django imports
#third party app imports
#my apps imports

from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

# Create your models here.
class AdditionalInfo(models.Model):
    created_at = models.DateTimeField(default=timezone.now())
    updated_at = models.DateTimeField(default=timezone.now())

    class Meta:
        abstract = True


#TODO activation related records, idp_url
class Client(AdditionalInfo):
	user = models.OneToOneField(User, primary_key=True)
	idp_url = models.CharField(max_length=100,  blank=True)
	phone_number = models.CharField(max_length=50)
	# client_priority = models.IntegerField(
	# 	default=1,
	# 	validators=[MaxValueValidator(100), MinValueValidator(1)]
	# 	)
	activation_key = models.CharField(max_length=40, blank=True)
    key_expires = models.DateTimeField()


	class Meta:
		db_table = 'user_profile'
	
	def __str__(self):
		return '%s' % (self.user.username)


#TODO only few teams to be allowed
class Team(models.Model):
	name = models.CharField(max_length=35)

	# REQUIRED_FIELDS = ['name']
	class Meta:
		db_table = 'team'

	def __str__(self):
		return '%s' % (self.name)


class TeamMember(AdditionalInfo):
	user = models.OneToOneField(User, related_name='team_member')
	team = models.ForeignKey(Team)
	phone_number = models.CharField(max_length=50)
	activation_key = models.CharField(max_length=40, blank=True)
    key_expires = models.DateTimeField()

	class Meta:
		db_table = 'team_member'

	def __str__(self):
		return '%s' % (self.user.username)
	

class ProjectManager(AdditionalInfo):
	user = models.OneToOneField(User, related_name='project_member')

	class Meta:
		db_table = 'project_manager'

	def __str__(self):
		return '%s' % (self.user.username)