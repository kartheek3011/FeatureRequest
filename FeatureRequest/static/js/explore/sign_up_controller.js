var app = angular.module('machinamaApp', []);

app.controller('SignUpController', function($scope, $window) {

	function checkEmpty(input,id){	
		var validation_flag = true;
		if (input == null || input == "") {
	        $(id).show();
	        validation_flag = false;
	    }else{
	    	$(id).hide();
	    }
	    return validation_flag; 
	}

	$scope.validate_client_form = function(dept){	


		var name = document.forms["signupform"]["name"].value;

	    var email = document.forms["signupform"]["email"].value;
		var email_validation_flag = checkEmpty(email,"#email_required");	

		var re = /\S+@\S+\.\S+/;		
	    if(email_validation_flag){    	
	    	if(!re.test(email) ){
	    		$("#email_error").show();
	    		email_validation_flag = false;
	    	}else{
	            $("#email_error").hide();
	            $.ajax({
	                url:"/check_user/",
	                async: false,
	                data:{                  // data that will be sent
	                    email:email
	                },
	                type:"POST",            // type of submision
	                success:function(data)
	                {
	                    //console.log(data['user_exists']);
	                    if (data["user_exists"] == "true") {
	                        $("#email_exists").show();
	                        email_validation_flag = false;
	                        return false;
	                    }else{
	                        $("#email_exists").hide();
	                    }
	                }
	            });
	        }
	    }
	    
	
	    var password = document.forms["signupform"]["password"].value;
		var password_validation_flag = checkEmpty(password,"#password_required");
		var password_length_flag = true;
		var password_correct_flag = true;

		if (password.length < 8) {		
			if (password_validation_flag) {
				$("#password_length_error").show();
				password_length_flag = false;
				password_correct_flag = false;
	    		password_validation_flag = false;	
			}		
		}else if (!password.match(/[0-9]/)) {
			if (password_validation_flag && password_length_flag) {
				$("#password_number_error").show();
				password_correct_flag = false;
	    		password_validation_flag = false;	
			};			 
		}else{
			$("#password_required").hide();
			$("#password_number_error").hide();
			$("#password_length_error").hide();
		}	

	    var phone_number = document.forms["signupform"]["phone_number"].value;

	    var idp_url = document.forms["signupform"]["idp_url"]

	    if (email_validation_flag && password_validation_flag) {
	    	var post_data = new FormData();
	    	post_data.append("name", name);
	        post_data.append("password", password);	               
	        post_data.append("email", email);
	        post_data.append("phone_number", phone_number);
	        post_data.append("idp_url", idp_url);
	        $scope.submit_form(post_data, 'client/create_account');	        
	    } 
	    else{
	    	return false;
	    };

	};

	$scope.validate_team_member_form = function(dept){	

		var name = document.forms["signupform"]["name"].value;

	    var email = document.forms["signupform"]["email"].value;
		var email_validation_flag = checkEmpty(email,"#email_required");	

		var re = /\S+@\S+\.\S+/;		
	    if(email_validation_flag){ 
	    	if(!re.test(email) ){
	    		$("#email_error").show();
	    		email_validation_flag = false;
	    	}else{
	            $("#email_error").hide();
	            $.ajax({
	                url:"/check_user/",
	                async: false,
	                data:{                  // data that will be sent
	                    email:email
	                },
	                type:"POST",            // type of submision
	                success:function(data)
	                {
	                    //console.log(data['user_exists']);
	                    if (data["user_exists"] == "true") {
	                        $("#email_exists").show();
	                        email_validation_flag = false;
	                        return false;
	                    }else{
	                        $("#email_exists").hide();
	                    }
	                }
	            });
	        }
	    }
	    
	
	    var password = document.forms["signupform"]["password"].value;
		var password_validation_flag = checkEmpty(password,"#password_required");
		var password_length_flag = true;
		var password_correct_flag = true;

		if (password.length < 8) {		
			if (password_validation_flag) {
				$("#password_length_error").show();
				password_length_flag = false;
				password_correct_flag = false;
	    		password_validation_flag = false;	
			}		
		}else if (!password.match(/[0-9]/)) {
			if (password_validation_flag && password_length_flag) {
				$("#password_number_error").show();
				password_correct_flag = false;
	    		password_validation_flag = false;	
			};			 
		}else{
			$("#password_required").hide();
			$("#password_number_error").hide();
			$("#password_length_error").hide();
		}	

		var team = document.forms["signupform"]["team"].value;
	   	var team_validation_flag = true;

	    if (team == 'Select Team') {
	        $('#team_required').show();
	        team_validation_flag = false;
	    } else{
	    	$('#team_required').hide();
	    	team_validation_flag = true;
	    };

	    var phone_number = document.forms["signupform"]["number"].value;

	    if (email_validation_flag && password_validation_flag && team_validation_flag){
	    	var post_data = new FormData();
	    	post_data.append("name", name);
	        post_data.append("password", password);	               
	        post_data.append("email", email);
	        post_data.append("team", team);
	        post_data.append("phone_number", phone_number);
	        $scope.submit_form(post_data, '/team_member/create_acount');

	    } else{
	    	return false;
	    };

	};

	

	$scope.submit_form = function(post_data, url){
		$.ajax({
              url: url,
              type: 'POST',
              data: post_data,
              success: function (response) {
              				$('#spinner').css({'display':'none'});              				
              				console.log(response);
                          	if(response.status == 'success'){
	                          	window.location.href = "/email_verification_msg";
	                        }

	                        if(response.status == 'error'){
	                        	console.log('ERROR')
	                        }
                      },
              error: function(data){
                        console.log("submit form error", data);
                      },
              cache: false,
              contentType: false,
              processData: false
          }).then(function(){            	  
          });
	}

});