var app = angular.module('machinamaApp', []);

app.controller('LoginController', function($scope, $window) {

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

	$scope.validate_form = function(){
	    var email = document.forms["LoginForm"]["email"].value;
		var email_validation_flag = checkEmpty(email,"#email_required");
		
		var password = document.forms["LoginForm"]["password"].value;
	    var password_validation_flag = checkEmpty(password,"#password_required");

	    var re = /\S+@\S+\.\S+/;		
	    if(email_validation_flag){    	
	    	if(!re.test(email) ){
	    		$("#email_error").show();
	    		email_validation_flag = false;
	    	}else{
	    		$("#email_error").hide();
	    	}
	    }

	    if(email_validation_flag && password_validation_flag){ 
	    	var post_data = new FormData();
	        post_data.append("email", email);
	        post_data.append("password", password);
	        $scope.submit_form(post_data, '/login');
	    }else{
	    	return false;
	    }
	};

	$scope.submit_form = function(post_data, url){
		$.ajax({
              url: url,
              type: 'POST',
              data: post_data,
              success: function (response) {
              				             				
              				console.log(response);
                          	if(response.status == 'success'){                          		
	                          	window.location.href = "/profile";
	                        }else if (response.status == 'error') {
	                        	$('#error_msg').css({'display':'block'});
	                        	$('#error_msg').text(response.error_msg);
	                        }
                      },
              error: function(data){
              			
                        console.log("submit form error", data);
                      },
              cache: false,
              contentType: false,
              processData: false
          });
	};

});

