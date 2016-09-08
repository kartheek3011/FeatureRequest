from django.shortcuts import render
from django.views.generic import View

from users.models import Client
from users.models import Team
from users.models import TeamMember
#TODO imports
# Create your views here.


    
def index(request):
    if request.user.is_authenticated():
        return redirect("/profile")
    return render(request, "index.html")


#TODO atomic transaction
#TODO userManager creation Models
#CHeck way to use django managers
#CHeck the email template
#Email refactoring at models
def create_account(request):

    if request.method == "GET":
        return render(request, "authenticate/signup.html")

    if request.method == "POST":
        try:
            name = request.POST.get('first_name')
            email = request.POST.get('email')
            password = request.POST.get('password')

            user = UserManager.get_user()
            client = UserManager.get_client()

            # Send Email Verfication to the user
            MailHandler.send_account_verification_mail(request, client)
            #MailHandler.send_email_with_template(email_subject, template_name, context, to_email_list)
            MailHandler.inform_admin(request, user, template="email_templates/new_user_signup.html")
            return JsonResponse({'status': 'success'})
        except ValueError:
            return JsonResponse({'status': 'error'})


@csrf_exempt
def check_user(request):
    """
     Check whether a user has already signed up
    :param request:  Http Request
    :return: response
    """
    email = request.POST.get('email')
    result = User.objects.filter(email=email)
    if result:
        return JsonResponse({'user_exists': 'true'})
    else:
        return JsonResponse({'user_exists': 'false'})


def email_verification_msg(request):
    return render(request, 'authenticate/email_verification_msg.html')

#Needs redefining

def confirm_email(request):
    activation_key = request.GET.get('activation_key')

    # check if there is UserProfile which matches the activation key (if not then display 404)
    user_profile = Profile.objects.get(activation_key=activation_key)

    # check if the activation key has expired, if it case then render confirm_expired.html
    if user_profile.key_expires < timezone.now():
        return render(request, 'confirm_expired.html')
    # if the key hasn't expired save user and set him as active and render some template to confirm activation
    user = user_profile.user
    user.is_active = True
    user.save()
    inform_admin(request, user)
    user.backend = 'django.contrib.auth.backends.ModelBackend'
    login(request, user)

    return redirect('home')

def logout_user(request):
    try:
        logout(request)
    except KeyError as e:
        print e
    return render(request, 'athenticate/login.html')


def password_generator(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def forgot_password(request):
    if request.method == 'GET':
        return render(request, 'authenticate/forgot_password.html')

    if request.method == 'POST':
        try:
            user_email = request.POST.get('email')
            user = User.objects.get(email=user_email)
            if user:
                password = password_generator()
                user.set_password(password)
                user.save()
                email_subject = 'Reset your password.'
                reset_password_email_template = get_template("email_templates/reset_password_email_template.html")
                with open(reset_password_email_template.origin.name, "r") as myfile:
                    data = myfile.read().replace('\n', '')

                template = Template(data)

                context = Context({"password": password, "host": request.META['HTTP_HOST']})

                email_body = str(template.render(context))

                msg = EmailMultiAlternatives(email_subject, email_body, 'Kartheek <kartheek3011@gmail.com>',
                                             [user_email])

                msg.attach_alternative(email_body, "text/html")
                msg.send()

                return render(request, 'authenticate/forgot_password.html',
                              {'user_exists': True,
                               'message': 'We have sent an email to you. Please follow the instructions in the email.',
                               'given_email': user_email}
                              )
            else:
                return render(request, 'authenticate/forgot_password.html',
                              {'user_exists': False, 'message': 'User does not exist with the given email',
                               'given_email': user_email}
                              )
        except User.DoesNotExist:
            return render(request, 'athenticate/forgot_password.html',
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
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        confirm_new_password = request.POST.get('confirm_new_password')
        email = request.POST.get('email')

        user = authenticate(username=email, password=old_password)

        if user is None:
            return render(request, 'athenticate/reset_password.html',
                          {'email': email, 'error': "Given email or password is incorrect"})
        else:
            user_profile = Profile.objects.get(user=user)
            if new_password == confirm_new_password:
                user.set_password(new_password)
                user.save()
                login(request, user)
                return redirect('home')
            else:
                return render(
                    request,
                    'reset_password.html',
                    {
                        'email': email,
                        'error': "Given email or password is incorrect",
                    }
                )


@csrf_exempt
@login_required
def profile(request):
    """
     Update Profile
    """
    if request.method == 'GET':
        user_profile = request.user.profile
        return render(request, 'profile.html',{ "user_profile": user_profile })
    elif request.method == 'POST':
        user_profile = request.user.profile
        try:
            # email = request.POST.get('email')
            request.user.first_name = request.POST.get('first_name')

            if request.POST.get('sur_name'):
                request.user.last_name = request.POST.get('sur_name')

            request.user.save()

            try:
                company_obj = Company.objects.get(name=request.POST.get('company'), country=request.POST.get('country'))
            except Company.DoesNotExist:
                company_obj = Company.objects.create(name=request.POST.get('company'), country=request.POST.get('country'))

            user_profile.company = company_obj

            email_domain = re.match(r'^.*@(.*)', request.user.email).groups()[0]
            try:
                role_obj = Role.objects.get(name=request.POST.get('department'), email_domain=email_domain)
            except Role.DoesNotExist:
                role_obj = Role.objects.create(name=request.POST.get('department'), email_domain=email_domain)

            user_profile.role = role_obj

            if request.POST.get('phone_number'):
                user_profile.phone_number = request.POST.get('phone_number')

            user_profile.save()

            return JsonResponse({'status': 'success'})
        except ValueError:
            return JsonResponse({'status': 'error'})

