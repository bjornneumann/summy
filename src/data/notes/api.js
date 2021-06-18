import { fetchApi } from '../../services/api';

const endPoints = {
	get: '/v1/notes.json',
	post: '/v1/notes.json',
	patch: '/v1/notes.json',
	delete: '/v1/notes/', // + note_id + '.json'
};

export const post = payload =>  {
	return fetchApi(endPoints.post, payload, 'post')
	.then(onRequestSuccess)
	.catch(onRequestFailed);
}

export const get = payload => fetchApi(endPoints.get, payload, 'get');

export const patch = payload =>  {
	return fetchApi(endPoints.patch, payload, 'patch')
	.then(onRequestSuccess)
	.catch(onRequestFailed);
}

export const remove = payload => fetchApi(endPoints.delete + payload.note_id + '.json', payload, 'delete');




/* Added Functions */


const onRequestSuccess = (response) => {

	if (response && (response.success == 'posted' || response.success == 'changed')) {
		return Promise.resolve(response);
	} else {

		// Server Error Handling

		var errors = [];
		var error_message = "";

		if (response.title_too_short_error) {
		    errors.push("Your title is too short. ");
		}
		if (response.title_too_long_error) {
		    errors.push("Your title is too long. ");
		}
		if (response.note_too_many_sections_error) {
		    errors.push("You have too many sections. ");
		}
		if (response.note_enough_sections_error) {
		    errors.push("You don't have enough sections. ");
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
