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
	client_priority = models.IntegerField(
		default=1,
		validators=[MaxValueValidator(100), MinValueValidator(1)]
		)
	activation_key = models.CharField(max_length=40, blank=True)
    key_expires = models.DateTimeField()

	class Meta:
		db_table = 'user_profile'
	
	def __str__(self):
		return '%s' % (self.user.username)

class Team(models.Model):
	name = models.CharField(max_length=35)
	
	class Meta:
		db_table = 'team'

	def __str__(self):
		return '%s' % (self.name)

class TeamMember(AdditionalInfo):
	user = models.OneToOneField(User, related_name='team_member')
	team = models.ForeignKey(Team)

	class Meta:
		db_table = 'team_member'

	def __str__(self):
		return '%s' % (self.user.username)
	



#TODO make a singleton object
class UserManager():

	def get_user(self, name, email, password):
		user = User.objects.create_user(name, email, password)
        user.is_active = False
        user.save()
        return user

    def get_client(self, user, request):
    	client = Client.objects.create(
            		user=user,
            		idp_url=request.POST.get('idp_url'),
            		phone_number=request.POST.get('phone_number'),
            		client_priority=request.POST.get('client_priority'),
        			)

        salt = hashlib.sha1(str(random.random())).hexdigest()[:5]
        client.activation_key = hashlib.sha1(salt+email).hexdigest()
        client.key_expires = datetime.datetime.today() + datetime.timedelta(3)
        client.save()
        return client


class MailHandler():

	#TODO redefine
    def send_account_verification_mail(request, client):
    	host = request.META['HTTP_HOST']
    	email_subject, template_name, context, to_email_list = MailBuilder.get_account_verification_context(client, host)
    	send_email_with_template(email_subject, template_name, context, to_email_list)


    def inform_admin(self, request, user, template=None, subject=None):
	    if subject:
	        email_subject = subject
	    else:
	        email_subject = 'New User'
	    if not template:
	        template_name = "email_templates/new_user_notification.html"
	    else:
	        template_name = template
	    context = Context({"user_name": user.email, "host": request.META['HTTP_HOST'], "user": user})
	    to_email_list = [settings.ADMIN_EMAIL]
	    MailHandler.send_email_with_template(email_subject, template_name, context, to_email_list)


	def send_email_with_template(email_subject, template_name, context, to_email_list):
    """
     Send email to users with provided template, context, subject
    """
    email_template = get_template(template_name)
    with open(email_template.origin.name, "r") as myfile:
        data = myfile.read().replace('\n', '')
    template = Template(data)
    email_body = str(template.render(context))
    count = 1
    for email in to_email_list:
        if email:
            print str(count)+": "+email
            count=count+1
            try:
                msg = EmailMultiAlternatives(email_subject, email_body, 'Kartheek <kartheek3011@gmail.com',
                                     [email])
                msg.attach_alternative(email_body, "text/html")
                msg.send()
            except:
                print "Unable to send email..."
                pass


class MailBuilder():

	def get_account_verification_context(self, client, host):
		name = client.user.username
		email_subject = 'Email confirmation.'
        template_name = "email_templates/account_verification.html"
        context = Context({"user_name": name, "host": host,
                               "activation_key": client.activation_key})
            to_email_list = [email]
        return email_subject, template_name, context, to_email_list

