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
import { emptyConnectionParams, emptyMessages, filterMessages, isMessageSuitedForFilters,	createFiltersValues,
	updateFiltersValues, getGroupShortName } from './utils'
import { MAX_MESSAGES_COUNT } from './constants'

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
			const { filters, filtersValues, all, filtered, nextMessageId } = state;
			if (all.size >= MAX_MESSAGES_COUNT) return state;
			const message = { ...action.message,
				id: nextMessageId,
				shortGroupName: getGroupShortName(action.message.group)
			};
			return {
				...state,
				all: all.push(message),
				filtered: isMessageSuitedForFilters(message, filters) ? filtered.push(message) : filtered,
				filtersValues: updateFiltersValues(filtersValues, filters, message),
				nextMessageId: nextMessageId + 1
			};
		case CLEAR_MESSAGES:
			return { ...emptyMessages(), nextMessageId: state.nextMessageId };
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