#core imports
import random
from hashlib import md5

#mails and templates
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context, Template
from django.db import transaction

#local imports
from users.models import Client
from users.models import Team, TeamMember

#TODO make a singleton object
class UserManager():

	def get_user(self, request):
		name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

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

        salt = sha1(str(random.random())).hexdigest()[:5]
        client.activation_key = sha1(salt+email).hexdigest()
        client.key_expires = datetime.datetime.today() + datetime.timedelta(3)
        client.save()
        return client   

    def get_team_member(self, user, team):
        team_member = TeamMember.objects.create(
                    user=user,
                    team=team
                    )
        salt = sha1(str(random.random())).hexdigest()[:5]
        team_member.activation_key = sha1(salt+email).hexdigest()
        team_member.key_expires = datetime.datetime.today() + datetime.timedelta(3)
        team_member.save()
        return team_member

    def save_client_profile_details(request):
        with transaction.atomic():
            user = request.user
            user.update(
                username = request.POST.get('username'),
                email = request.POST.get('email')
                )
            user.save()
            if request.POST.get('password'):
                user.set_password(request.POST.get('password'))
            
            client = Client.objects.filter(user=user).update(
                idp_url = request.POST.get('idp_url'),
                phone_number = request.POST.get('phone_number'),
                # client_priority = request.POST.get('client_priority')
                )
            client.save()

    def save_team_member_profile_details(request):
        with transaction.atomic():
            user = request.user
            user.update(
                username = request.POST.get('username'),
                email = request.POST.get('email')
                )
            user.save()
            if request.POST.get('password'):
                user.set_password(request.POST.get('password'))
            
            if request.POST.get('team_name'):
                team = Team.objects.filter(name=team_name)
                team_member = TeamMember.objects.filter(user=user).update(
                            team = team
                            )
                team_member.save()

class MailHandler():

	#TODO redefine
    def send_account_verification_mail(request, client):
    	host = request.META['HTTP_HOST']
    	email_subject, template_name, context, to_email_list = MailBuilder.get_account_verification_context(client, host)
    	send_email_with_template(email_subject, template_name, context, to_email_list)

    def send_reset_password_mail(request, user):
        host = request.META['HTTP_HOST']
        email_subject, template_name, context, to_email_list = MailBuilder.get_reset_password_context(user, host)
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
	    send_email_with_template(email_subject, template_name, context, to_email_list)


    #Recheck method
    #can be actually placed in queue with celery
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
                    msg = EmailMultiAlternatives(email_subject, email_body, 'Kartheek <kartheek3011@gmail.com>',
                                         [email])
                    msg.attach_alternative(email_body, "text/html")
                    msg.send()
                except:
                    print "Unable to send email..."


class MailBuilder():

	def get_account_verification_context(self, client, host):
		email = client.user.email
        name = client.user.username
		email_subject = 'Email confirmation.'
        template_name = "email_templates/account_verification.html"
        context = Context({"user_name": name, "host": host,
                               "activation_key": client.activation_key})
        to_email_list = [email]
        return email_subject, template_name, context, to_email_list


    def get_reset_password_context(self, user, password, host):
        email = user.email
        email_subject = 'Reset your password.'
        template_name = "email_templates/reset_password_email_template.html"
        context = Context({"password": password, "host": host})
        to_email_list = [email]
        return email_subject, template_name, context, to_email_list


def password_generator(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
