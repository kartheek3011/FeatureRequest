var app = angular.module('machinamaApp', []);

app.controller('ProfileController', function($scope, $window) {
	
	var country = $('#given_country').data("country");
	var dept = $('#given_dept').data("dept");

	$scope.country = country;
	$scope.dept = dept; 

	$scope.waiting = false;

	$scope.countries = [ 
		"Select","Afghanistan","Åland Islands","Albania","Algeria","American Samoa","AndorrA","Angola","Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo, The Democratic Republic of the","Cook Islands","Costa Rica","Cote D\"Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands (Malvinas)","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and Mcdonald Islands","Holy See (Vatican City State)","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran, Islamic Republic Of","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Korea, Democratic People\"S Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao People\"S Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia, The Former Yugoslav Republic of","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldova, Republic of","Monaco","Mongolia","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestinian Territory, Occupied","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russian Federation","RWANDA","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia and Montenegro","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the South Sandwich Islands","Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Swaziland","Sweden","Switzerland","Syrian Arab Republic","Taiwan, Province of China","Tajikistan","Tanzania, United Republic of","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela","Viet Nam","Virgin Islands, British","Virgin Islands, U.S.","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"
	];

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

	$scope.validate_form = function(country, dept){	
		
		var fname = document.forms["profile_form"]["fname"].value;
	    var fname_validation_flag = checkEmpty(fname,"#fname_required");

	    var sname = document.forms["profile_form"]["sname"].value;
		var sname_validation_flag = checkEmpty(sname,"#sname_required");

	    /*var email = document.forms["profile_form"]["email"].value;
		var email_validation_flag = checkEmpty(email,"#email_required");	

		var re = /\S+@\S+\.\S+/;		
	    if(email_validation_flag){    	
	    	if(!re.test(email) ){
	    		$("#email_error").show();
	    		email_validation_flag = false;
	    	}
	    }
	    
	    var is_company_id;
	    if(email_validation_flag){ 	    	
	    	var a = ['gmail', 'yahoo', 'hotmail']
	    	if (a.indexOf(email.split('@')[1].split('.')[0]) >= 0){
	    		$('#company_id_error').show();
	    		is_company_id = false;
	    	}else{
	    		$('#company_id_error').hide();
	    		is_company_id = true;
	    	}
	    }	*/    

	    var phone_number = document.forms["profile_form"]["phone_number"].value;

	    var company = document.forms["profile_form"]["company"].value;
	    var company_validation_flag = checkEmpty(company,"#company_required");

	    var dept_validation_flag;
	    if (dept == 'Select') {	    	
	        $('#dept_required').show();
	        dept_validation_flag = false;
	    } else{
	    	$('#dept_required').hide();
	    	dept_validation_flag = true;
	    };

	    
	    var country_validation_flag;
	    if (country == 'Select') {	    	
	        $('#country_required').show();
	        country_validation_flag = false;
	    } else{
	    	$('#country_required').hide();
	    	country_validation_flag = true;
	    };


	    if (fname_validation_flag && sname_validation_flag && country_validation_flag && dept_validation_flag &&  company_validation_flag) {
	    	var post_data = new FormData();
	    	post_data.append("sur_name", sname);
	        post_data.append("first_name", fname);
	        post_data.append("company", company);
	        post_data.append("country", country);
	        post_data.append("department", dept);
	        post_data.append("phone_number", phone_number);
	        $scope.submit_form(post_data, '/profile');

	    } else{
	    	return false;
	    };

	};

	$scope.submit_form = function(post_data, url){
		$('#spinner').css({'display':'inline-block'});
		$scope.waiting = true;
		$.ajax({
              url: url,
              type: 'POST',
              data: post_data,
              success: function (response) {
              				$('#spinner').css({'display':'none'});              				
              				console.log(response);
              				$scope.waiting = false;
                          	if(response.status == 'success'){
                          		$('#profile_updated').css({'display':'block'});
	                          	console.log("success");
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
            	$('#spinner').css({'display':'none'});   
          });
	}

});