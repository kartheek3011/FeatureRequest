# FeatureRequest
The features are requested and tracked.<br />
Current work being done is in Version1 branch as of now.

##INTRODUCTION:
	The application develops a feature that helps in finalizing the interaction between the clients and the product owner.
	The teams are assumed to be working independent. They are based on the functionality they provide.
	For eg: Invoice Management, Order Management, Reports. 

	The normal user groups:
	1. Clients
	2. Project Manager
	3. Admin
	4. Team

##Roles
1.Clients<br />
	-Make a feature request.<br />
	-Participates in discussion on feature requests.<br />

2.Project Manager<br />
	-Team Management.<br />
	-Features status change, prioritisation and allocation.<br />

3.Team Members<br />
	-Participates in discussion on feature requests.<br />
	 

##DEVELOPMENT PHASES AND VERSIONS:
	Version 1
		Features-
			1. Normal user login feature.
			2. Feature tracking without notifications.
			3. Team management by project Manager.

		The major application dependencies:
			Backend - 
			1. Django 					1.10.1
			2. Django_extensions 		1.7.4
			3. Pip						8.1.2
			4. Virtualenvwrapper		4.7.2

			Frontend -
			1. Html5
			2. AngularJs 

	Version 2
		Features-
			1. The SAML based user login version using the already present IDP.
			2. Feature tracking with notifications enabled. 
														(CRITICAL FEATURE)
			3. Feature gets reassigned to other team by Project Manger.

		The major application dependencies:
			Backend - 
			1. Rethink DB for notifications.


	Version 3
		Features-
			1. The feature check with providing IDP ourselves. 
			2. The email service notification provider.

	Version 4
		Features-
			1. The feature of multiple conversation in a single window.
			2. The archieving oef features and conversations by project Manager.

##NOTE:
		1.I would like to have few guidelines in designing and implementing  the versions 3 and 4.
		
##DEPLOYMENT STEPS:

##TODO
	Version1 features yet to be brought live.
