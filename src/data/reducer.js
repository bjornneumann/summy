import { combineReducers } from 'redux';
import { reducer as usersReducer } from './users/reducer';
import { reducer as notesReducer } from './notes/reducer';

export const reducer = combineReducers({
	users: usersReducer,
	notes: notesReducer
});
