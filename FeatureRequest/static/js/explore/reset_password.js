function validateForm(form_name){
    console.log(form_name);
    $(".custom_error_message").hide();

    var email = document.forms["ResetPasswordForm"]["email"].value;

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

    var old_password = document.forms["ResetPasswordForm"]["old_password"].value;
    var old_password_validation_flag = checkEmpty(old_password,"#given_password_required");

    var password = document.forms["ResetPasswordForm"]["new_password"].value;
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


    var confirm_password = document.forms["ResetPasswordForm"]["confirm_new_password"].value;
    var conform_password_validation_flag = null;

    if (confirm_password == null || confirm_password == "") {
        $("#cpassword_required").show();
        conform_password_validation_flag = false;
    }else{
        $("#cpassword_required").hide();
        conform_password_validation_flag = true
        if (confirm_password != password) {
            $("#passwords_no_match").show();
            conform_password_validation_flag = false;
        }else{
            $("#passwords_no_match").hide();
            conform_password_validation_flag = true;
        }

    }

    if(conform_password_validation_flag && password_validation_flag && email_validation_flag && old_password_validation_flag){
        return true;
    }else{
        return false;
    }
 }


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