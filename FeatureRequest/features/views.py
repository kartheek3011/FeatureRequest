from django.shortcuts import render
from django.views import View

from features.models import FeatureRequest, DiscussionComment
# Create your views here.

#django imports
from django.shortcuts import render, render_to_response, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction

#files and exceptions

#local imports
from users.models import Client
from users.models import Team, TeamMember
from features.models import FeatureRequest, DiscussionComment


#NEED MANY IMPORTS
#NEED MODELS IMPORTS
#TODO project manager - view by teams.
#drag and drop prioritisation
@login_required
def features(request):
	if request.user.client:
		client = request.user.client
		feature_requests = FeatureRequest.objects.filter(client=client)
	else if request.user.team_member:
		team = request.user.team_member.team
		feature_requests = FeatureRequest.objects.filter(team=team)
	else if request.user.is_superuser:
		feature_requests = FeatureRequest.objects.all()

	context = RequestContext(request, {'feature_requests': feature_requests})
	return render_to_response('features.html', context)

#post needs to be done
#add comments in template
@login_required
def feature(request, feature_id):
	if request.user.is_superuser:
		if request.method == "GET":
			feature = FeatureRequest.objects.filter(id=feature_id)
			context = RequestContext(request, {'feature': feature})
			return render_to_response('manager/feature.html', context)
		if request.method == "POST":
			team = Team.objects.get(name=request.POST.get('team_name'))
			client = request.objects.client
			id = request.POST.get('feature_id')
			feature = FeatureRequest.objects.filter(id=id).update(
				title = request.POST.get('title')
				description = request.POST.get('description')
				ticket_url = request.POST.get('ticket_url')
				status = 'Fresh'
				feature_priority = request.POST.get('feature_priority') 
				target_date = request.POST.get('target_date')
				team_assigned = team
				client =  client
				)
			context = RequestContext(request, {'feature': feature})
			return render_to_response('manager/feature.html', context)	
	else:
		feature = FeatureRequest.objects.filter(id=feature_id)
		context = RequestContext(request, {'feature': feature})
		return render_to_response('client_and_team/feature.html', context)

#TODO mixin permission only to client
@login_required
def create_feature(request):
	if request.method == "GET":
		return render('create_feature.html')
	if request.method == "POST":
		team = Team.objects.get(name=request.POST.get('team_name'))
		client = request.objects.client
		feature = FeatureRequest.objects.create(
			title = request.POST.get('title')
			description = request.POST.get('description')
			ticket_url = request.POST.get('ticket_url')
			status = 'Fresh'
			feature_priority = request.POST.get('feature_priority') 
			target_date = request.POST.get('target_date')
			team_assigned = team
			client =  client
			)
	
	context = RequestContext(request, {'feature': feature})
	return render_to_response('new_feature.html', context)
 
#TODO return and permission restriction to only client
@login_required
def add_comment(request):
	feature_id = request.POST.get('feature_id')
	feature = feature.object.get(id=feature_id)
	user = request.user
	content = request.POST.get('content')	
	comment = DiscussionComment.objects.create(
		user = user
		feature = feature
		content = content
		)
	return JsonResponse({'content': content, 'user': user})
