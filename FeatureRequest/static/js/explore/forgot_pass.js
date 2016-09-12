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


function validate_email(form_name){
    console.log(form_name);

    var email = document.forms["ForgotPassword"]["email"].value;

	var email_validation_flag = checkEmpty(email,"#email_required");

	var re = /\S+@\S+\.\S+/;

    if(email_validation_flag){
    	if(!re.test(email) ){
    		$("#email_error").show();
    		email_validation_flag = false;
    	}else{
    	    $('#email_required').hide();
    	    email_validation_flag = true;
    	}
    }else{
        $("#email_error").hide();
        email_validation_flag = false
    }

    if(email_validation_flag){
        return true;
    }else{
        return false;
    }
}