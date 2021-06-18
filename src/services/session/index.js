import store from '../../store';

import * as api from './api';
import * as selectors from './selectors';
import * as actionCreators from './actions';
import { initialState } from './reducer';

const SESSION_TIMEOUT_THRESHOLD = 300; // Will refresh the access token 5 minutes before it expires

let sessionTimeout = null;

const setSessionTimeout = (duration) => {
	clearTimeout(sessionTimeout);
	sessionTimeout = setTimeout(
		refreshToken, // eslint-disable-line no-use-before-define
		(duration - SESSION_TIMEOUT_THRESHOLD) * 1000
	);
};

const clearSession = () => {
	clearTimeout(sessionTimeout);
	store.dispatch(actionCreators.update(initialState));
};

const onRequestSuccess = (response) => {
	/*
	const tokens = response.tokens.reduce((prev, item) => ({
		...prev,
		[item.type]: item,
	}), {});
	*/

	// Check if Authentication or Refreshing was successful

	// As respone.refreshed isn't returned from server for now, just checking if new access_token was issued
	if (response && (response.action === 'signed_in' /*|| response.refreshed == true*/ || (response.access_token && response.access_token.length !== 0) || response.fb_login_state === 'success')) {

		const tokens = {
			access: {
				type: 'access',
				value: response.access_token,
				expiresIn: response.expires_in
			},
			refresh: {
				type: 'refresh',
				value: response.refresh_token
			}
		}
		store.dispatch(actionCreators.update({ tokens, user: { id: null } }));
		setSessionTimeout(tokens.access.expiresIn);

	} else {
		//return Promise.reject(new Error('Your login data is incorrect.'));
		throw 'Your login data is incorrect.'; // To make error visible
	}

};

const onRequestFailed = (exception) => {
	clearSession();
	throw exception;
};

export const refreshToken = () => {
	const session = selectors.get();

	if (!session.tokens.refresh.value) {
		return Promise.reject();
	}

    let payload = {};
    payload.grant_type = "refresh_token";
    payload.client_id = "apiclient";
    payload.refresh_token = session.tokens.refresh.value;

	return api.refresh(payload)
	.then(onRequestSuccess)
	.catch(onRequestFailed);
};

export const authenticate = (email, password) => {

    let payload = {};
    payload.grant_type = "password";
    payload.client_id = "apiclient";
    payload.username = email;
    payload.password = password;

	return api.authenticate(payload)
	.then(onRequestSuccess)
	.catch(onRequestFailed);

}


export const fbAuthenticate = (access_token) => {

    let payload = {};
    payload.grant_type = "facebook";
    payload.client_id = "apiclient";
    payload.access_token = access_token;

    return api.fbAuthenticate(payload)
    .then(onRequestSuccess)
    .catch(onRequestFailed);
}


export const resetPassword = (email) => {

	let payload = {};
	payload.user = {};
	payload.user.email = email;

	return api.resetPassword(payload)
    .then((response) => {

    	let error_message = null;

    	switch(response.email_error) {
    		case 2: 
    			error_message = "Please enter a valid email address.";
    			break;
    		case 4:
    			error_message = "Email provided is not recognized";
    			break;
    		default:
    			error_message = "There was an error"

    	}

    	if(response.email_error) {
    		return Promise.reject(new Error(error_message));
    	}

    	if(response.action === "reset") {
    		return Promise.resolve(response);
    	}
    })
    .catch((exception) => {
		throw exception;
	});

}


export const revoke = () => {
	/*
	const session = selectors.get();
	return api.revoke(Object.keys(session.tokens).map(tokenKey => ({
		type: session.tokens[tokenKey].type,
		value: session.tokens[tokenKey].value,
	})))
	.then(clearSession())
	.catch(() => {});
	*/

	let promise = Promise.resolve("Log out"); // UPDATE later with commented out code above
	return promise.then(clearSession()); // UPDATE later with commented out code above

};
