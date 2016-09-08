#Django imports
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

#local imports
from users.models import Team
from users.models import Client

# Create your models here.

class AdditionalInfo(models.Model):
    created_at = models.DateTimeField(default=timezone.now())
    updated_at = models.DateTimeField(default=timezone.now())

    class Meta:
        abstract = True

#TODO ticket urls, image storage
#TODO may be Django Transition be used.
#Tracking recent comment timestamp.
class FeatureRequest(AdditionalInfo):
	STATUS_CHOICES=(
		('Fresh', "Fresh"),
		('InDiscussion', "InDiscussion"),
		('InWork', "InWork"),
		('Closed', "Closed"),
		('Archieve', "Archieve"),
		)

	#identity features
	title = models.CharField(max_length=30)
	description = models.TextField(max_length=150)
	ticket_url = models.CharField(max_length=100)
	status = models.CharField(max_length=100, STATUS_CHOICES)
	#critical features
	feature_priority = models.IntegerField(
		default=1,
		validators=[MaxValueValidator(100), MinValueValidator(1)]
		)
	target_date = models.DateTimeField(default=timezone.now())
	team_assigned = models.ForeignKey(Team)
	client =  models.ForeignKey(Client)

	def __str__(self):
		return '%s' % (self.title)

class discussion_comment(AdditionalInfo):
	content = models.TextField(max_length=150)
	request = models.ForeignKey(FeatureRequest)
	user = models.ForeignKey(User)

	def __str__(self):
		return '%s' % (self.user + ':' + self.content[10] + '...')
