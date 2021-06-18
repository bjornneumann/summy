import { Buffer } from 'buffer';
import { fetchApi } from '../api';
import apiConfig from '../api/config';

const endPoints = {
	authenticate: '/token',
	revoke: '/users/auth/revoke',
	refresh: '/token',
	reset: '/v1/user/password.json'
};

export const fbAuthenticate = (payload) => fetchApi(endPoints.authenticate, payload, 'post');

export const authenticate = (payload) => fetchApi(endPoints.authenticate, payload, 'post');

export const refresh = (payload) => fetchApi(endPoints.refresh, payload, 'post');

export const revoke = tokens => fetchApi(endPoints.revoke, { tokens }, 'post');

export const resetPassword = (payload) => fetchApi(endPoints.reset, payload, 'post');
