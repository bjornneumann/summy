import { fetchApi } from '../../services/api';

const endPoints = {
	create: '/v1/register.json',
	get: '/v1/profile.json',
};

export const create = payload =>  {

	return fetchApi(endPoints.create, payload, 'post')
	.then(onRequestSuccess)
	.catch(onRequestFailed);

}


export const get = payload => fetchApi(endPoints.get, payload, 'get');




/* Added Functions */


const onRequestSuccess = (response) => {

	if (response && response.action == 'signed_up') {
		return Promise.resolve(response);
	} else {

		// Server Error Handling

		var errors = [];
		var error_message = "";

		if (response.gender_error) {
		    errors.push("Please select your gender. ");
		}
		if (response.first_name_error) {
		    errors.push("Please type in your first name. ");
		}
		if (response.last_name_error) {
		    errors.push("Please type in your last name. ");
		}

		switch (response.email_error) {
		    case 1:
		        errors.push("Please type in your email address. ");
		        break;
		    case 2:
		        errors.push("Please enter a valid email address. ");
		        break;
		    case 3:
		        errors.push("Email provided is already in use. ");
		        break;
		    case 4:
		        errors.push("You are already registered, but you have not confirmed your email address yet. To confirm your email address go to your emails and click on the confirmation link. If you don't see a message from us make sure to check your spam folder. ");
		        break;
		}

		if (response.password_error) {
		    errors.push("Password is too short. ");
		}

		if (errors !== null) {
		    for (var i = 0; i < errors.length; i++) {
		        error_message += "\n\n" + errors[i];
		    }
		} else {
			error_message = "There was an error signing up. ";
		}

		// Returning Error Message

		return Promise.reject(new Error(error_message));

	}

};

const onRequestFailed = (exception) => {
	throw exception;
};