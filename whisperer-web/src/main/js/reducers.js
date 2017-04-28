import { combineReducers } from "redux";
import {
	START_LISTENING,
	SET_CONNECTION_PARAMS,
	STOP_LISTENING,
	MESSAGE_RECEIVED,
	SET_SSE_CONNECTION,
	CLEAR_MESSAGES,
	UPDATE_FILTERS
} from "./actions";
import { emptyConnectionParams, emptyMessages, filterMessages, isMessageSuitedForFilters, emptyFilterValues,
	createFiltersValues, updateFiltersValues } from './utils'
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

const sseConnection = (state = null, action) => {
	switch (action.type) {
		case SET_SSE_CONNECTION:
			return action.connection;
		default:
			return state
	}
};


const messages = (state = emptyMessages(), action) => {
	switch (action.type) {
		case MESSAGE_RECEIVED:
			const { filters, filtersValues, all, filtered } = state;
			const message = action.message;
			if (all.length >= MAX_MESSAGES_COUNT) return state;
			const newAll = all.push(message);
			return {
				...state,
				all: newAll,
				filtered: isMessageSuitedForFilters(message, filters) ? filtered.push(message) : filtered,
				filtersValues: updateFiltersValues(filtersValues, filters, message)
			};
		case CLEAR_MESSAGES:
			return emptyMessages();
		case UPDATE_FILTERS:
			const newFilters = action.filters;
			return {
				...state,
				filters: newFilters,
				filtered: filterMessages(state.all, newFilters),
				filtersValues: createFiltersValues(state.all, newFilters)
			};
		default:
			return state
	}
};

const rootReducer = combineReducers({
	isListening,
	connectionParams,
	sseConnection,
	messages
});

export default rootReducer;