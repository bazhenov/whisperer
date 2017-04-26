import { combineReducers } from "redux";
import {
	START_LISTENING,
	SET_CONNECTION_PARAMS,
	STOP_LISTENING,
	MESSAGE_RECEIVED,
	SET_SSE_CONNECTION,
	CLEAR_MESSAGES,
	UPDATE_FILTERS,
	SET_FILTERS_VALUES
} from "./actions";
import { emptyFilter, emptyConnectionParams, emptyFilterValues } from './utils'
import { MAX_MESSAGES_COUNT } from './constants'
import { List } from 'immutable'

const isListening = (state = false, action) => {
	switch (action.type) {
		case START_LISTENING:
			return true;
		case STOP_LISTENING:
			return false;
		default:
			return state
	}
};

const connectionParams = (state = emptyConnectionParams(), action) => {
	switch (action.type) {
		case SET_CONNECTION_PARAMS:
			return action.connectionParams;
		default:
			return state
	}
};

const messages = (state = new List(), action) => {
	switch (action.type) {
		case MESSAGE_RECEIVED:
			if (state.length >= MAX_MESSAGES_COUNT) return state;
			return state.push(action.message);
		case CLEAR_MESSAGES:
			return new List();
		default:
			return state
	}
};

const sseConnection = (state = null, action) => {
	switch (action.type) {
		case SET_SSE_CONNECTION:
			return action.connection;
		default:
			return state
	}
};

const filters = (state = emptyFilter(), action) => {
	switch (action.type) {
		case UPDATE_FILTERS:
			return action.filters;
		default:
			return state
	}
};

const filtersValues = (state = emptyFilterValues(), action) => {
	switch (action.type) {
		case SET_FILTERS_VALUES:
			return action.filtersValues;
		default:
			return state
	}
};

const rootReducer = combineReducers({
	isListening,
	connectionParams,
	messages,
	sseConnection,
	filters,
	filtersValues
});

export default rootReducer;