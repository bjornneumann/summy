import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//import devTools from 'remote-redux-devtools';
//import { persistStore, autoRehydrate } from 'redux-persist';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import createFilter from 'redux-persist-transform-filter';

import { reducer as dataReducer } from './data/reducer';
import { reducer as servicesReducer } from './services/reducer';
import * as persistActionCreators from './services/persist/actions';

const appReducer = combineReducers({
	services: servicesReducer,
	data: dataReducer,
});

const enhancer = compose(
	applyMiddleware(
		thunk,
	),
	//devTools({ hostname: 'localhost', port: 3000, suppressConnectErrors: false })
);


// Persist 

const saveAndLoadSessionFilter = createFilter(
  'services'
);

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['data'],
  transforms: [saveAndLoadSessionFilter]
}

const persistedReducer = persistReducer(persistConfig, appReducer)

/*
const store = createStore(
	appReducer,
	enhancer,
	autoRehydrate(),
);


export const persist = persistStore(store, {
	storage: AsyncStorage,
	blacklist: ['data'],
	transforms: [saveAndLoadSessionFilter],
}, () => store.dispatch(persistActionCreators.update({ isHydrated: true })));

export default store;

*/



const store = createStore(persistedReducer, enhancer)

export const persist = persistStore(store, null, () => store.dispatch(persistActionCreators.update({ isHydrated: true })));

export default store;


