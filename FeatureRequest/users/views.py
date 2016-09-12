#core imports
import random
from hashlib import md5

#django imports
from django.shortcuts import render, render_to_response, redirect
from django.views.generic import View
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction

#files and exceptions
from django.core.files import File
from django.core.exceptions import PermissionDenied

#mails and templates
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context, Template

#local imports
from users.models import Client
from users.models import Team, TeamMember
from users.logic import UserManager, MailHandler, MailBuilder
from users.logic import password_generator

#TODO imports
# Create your views here.

def index(request):
    if request.user.is_authenticated():
        return redirect("/profile")
    return render(request, "index.html")

def client_create_account(request):

    if request.method == "GET":
        return render(request, "authenticate/client_signup.html")

    if request.method == "POST":
        try:
            with transaction.atomic():
                user = UserManager.get_user(request)
                client = UserManager.get_client(user, request)

            # Send Email Verfication to the user
            MailHandler.send_account_verification_mail(request, client)
            MailHandler.inform_admin(request, user, template="email_templates/new_user_signup.html")
            return JsonResponse({'status': 'success'})
        
        except ValueError:
            return JsonResponse({'status': 'error'})



#Django Managers
#Email templates
def team_member_create_account(request):

    if request.method == "GET":
        return render(request, "authenticate/team_member_signup.html")

    if request.method == "POST":
        try:   
            with transaction.atomic():         
                user = UserManager.get_user(request)
                team = Team.objects.create(name=Request.POST.get('team'))
                team_member = UserManager.get_team_member(user, team)

            # Send Email Verfication to the user
            MailHandler.send_account_verification_mail(request, team_member)
            #MailHandler.send_email_with_template(email_subject, template_name, context, to_email_list)
            MailHandler.inform_admin(request, user, template="email_templates/new_user_signup.html")
            return JsonResponse({'status': 'success'})
        except ValueError:
            return JsonResponse({'status': 'error'})


#Check the pre dependenct template
@csrf_exempt
def check_user(request):

    email = request.POST.get('email')
    result = User.objects.filter(email=email)
    if result:
        return JsonResponse({'user_exists': 'true'})
    else:
        return JsonResponse({'user_exists': 'false'})


def email_verification_msg(request):
    return render(request, 'authenticate/email_verification_msg.html')

#IMP Needs refinement. Add logic for team_members
#login REDEFINE local
def confirm_email(request):
    activation_key = request.GET.get('activation_key')

    # check if there is UserProfile which matches the activation key (if not then display 404)
    client = Client.objects.get(activation_key=activation_key)

    if client is not None:
        # check if the activation key has expired, if it case then render confirm_expired.html
        if client.key_expires < timezone.now():
            return render(request, 'confirm_expired.html')
        # if the key hasn't expired save user and set him as active and render some template to confirm activation
        user = client.user
        user.is_active = True
        user.save()
        inform_admin(request, user)
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
        return redirect('/profile')


@csrf_exempt
def login_user(request):
    if request.method == 'GET':
        return render(request, "authenticate/login.html")
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(username=email, password=password)

        if user is None:
            return JsonResponse({'status': 'error', 'error_msg': 'Email or password is incorrect'})
        elif not user.is_active:
            return JsonResponse({'status': 'error', 'error_msg': 'Your email is not yet verified'})
        else:
            login(request, user)
            return JsonResponse({'status': 'success', 'redirect_url': '/profile'})

@login_required
def logout_user(request):
    try:
        logout(request)
    except KeyError as e:
        print e
    return render(request, 'index.html')

#Needs redefine
def forgot_password(request):
    if request.method == 'GET':
        return render(request, 'authenticate/forgot_password.html')

    if request.method == 'POST':
        try:
            user_email = request.POST.get('email')
            user = User.objects.get(email=user_email)
            if user:
                #temporary password set
                password = password_generator()
                user.set_password(password)
                user.save()

                MailHandler.send_reset_password_mail(request, user)

                return render(request, 'authenticate/forgot_password.html',
                              {'user_exists': True,
                               'message': 'We have sent an email to you. Please follow the instructions in the email.',
                               'given_email': user_email}
                              )
            else:
                return render(request, 'authenticate/forgot_password.html',
                              {
                                  'user_exists': False, 
                                  'message': 'User does not exist with the given email',
                                  'given_email': user_email}
                              )
        except User.DoesNotExist:
            return render(request, 'authenticate/forgot_password.html',
                        {
                            'user_exists': False,
                            'message': 'User does not exist with the given email',
                            'given_email': user_email
                        }
                    )


def reset_password(request):
    if request.method == 'GET':
        return render(request, 'authenticate/reset_password.html')
    if request.method == 'POST':
        email = request.POST.get('email')
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        confirm_new_password = request.POST.get('confirm_new_password')
        
        user = authenticate(username=email, password=old_password)

        if user is None:
            return render(request, 'authenticate/reset_password.html',
                          {'email': email, 
                           'error': "Given email or password is incorrect"
                          })
        else:
            if new_password == confirm_new_password:
                user.set_password(new_password)
                user.save()
                login(request, user)
                return redirect('profile')
            else:
                return render(request, 'reset_password.html',
                    {'email': email,
                     'error': "Given passwords donot match",
                    })


@csrf_exempt
@login_required
def profile(request):
    """
    Update Profile
    """

    if request.method == 'GET':
        if request.user.client:
            client = request.user.client
            return render(request, 'client_profile.html',{ "client": client })

        elif request.user.team_member:
            team_member = request.user.team_member
            return render(request, 'team_member_profile.html',{ "team_member": team_member })


    elif request.method == 'POST':
        if request.user.client:
            UserManager.save_client_profile_details(request)

        elif request.user.team_member:
            UserManager.save_team_member_profile_details(request)
            
        redirect('/profile')
