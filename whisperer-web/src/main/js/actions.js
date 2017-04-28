import queryString from 'query-string';
import { newConnectionParams } from  './utils'
import { SSE_RECONNECT_TIMEOUT, LS_CONNECTION_PARAMS_KEY, MAX_MESSAGES_COUNT } from './constants'

export const START_LISTENING = 'START_LISTENING';
export const STOP_LISTENING = 'STOP_LISTENING';
export const SET_CONNECTION_PARAMS = 'SET_CONNECTION_PARAMS';
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const SET_SSE_CONNECTION = 'SET_SSE_CONNECTION';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const UPDATE_FILTERS = 'UPDATE_FILTERS';

export const loadConnectionParams = () => {
	return dispatch => {
		const connectionParamsStr = localStorage.getItem(LS_CONNECTION_PARAMS_KEY);
		if (connectionParamsStr !== null) {
			const json = JSON.parse(connectionParamsStr);
			const connectionParams = newConnectionParams(json.key, json.value, json.prefix, json.severity);
			dispatch(
				setConnectionParams(connectionParams)
			);
		}
	};
};

export const updateConnectionParams = (connectionParams) => {
	return dispatch => {
		localStorage.setItem(LS_CONNECTION_PARAMS_KEY, JSON.stringify(connectionParams));
		dispatch(
			setConnectionParams(connectionParams)
		);
	};
};

export const setConnectionParams = (connectionParams) => {
	return {
		type: SET_CONNECTION_PARAMS,
		connectionParams: connectionParams
	}
};

export const receiveMessage = (message) => {
	return {
		type: MESSAGE_RECEIVED,
		message: message
	}
};

export const startListening = () => {
	return { type: START_LISTENING }
};

export const stopListening = () => {
	return { type: STOP_LISTENING }
};

export const setSSEConnection = (connection) => {
	return {
		type: SET_SSE_CONNECTION,
		connection: connection
	}
};

export const connectToSSE = () => {
	return (dispatch, getState) => {
		const { sseConnection, isListening, connectionParams } = getState();
		if (isListening && sseConnection === null) {
			const getParams = queryString.stringify({
				k: connectionParams.key,
				v: connectionParams.value,
				prefix: connectionParams.prefix,
				level: connectionParams.severity
			});
			const sseConnection = new EventSource('http://localhost:8082/stream?' + getParams);
			sseConnection.addEventListener('log', function(e) {
				if (getState().messages.all.size >= MAX_MESSAGES_COUNT) {
					console.log('To many messages, can\'t store more than ' + MAX_MESSAGES_COUNT);
					dispatch(stopListening());
					dispatch(disconnectFromSSE());
				} else {
					const message = JSON.parse(e.data);
					dispatch(receiveMessage(message))
				}
			}, false);
			sseConnection.onerror = () => {
				dispatch(disconnectFromSSE());
				setTimeout(() => dispatch(connectToSSE()), SSE_RECONNECT_TIMEOUT);
			};
			dispatch(setSSEConnection(sseConnection));
		}
	}
};

export const disconnectFromSSE = () => {
	return (dispatch, getState) => {
		const { sseConnection, isListening } = getState();
		if (!isListening && sseConnection !== null) {
			sseConnection.close();
			dispatch(setSSEConnection(null));
		}
	}
};

export const clearMessages = () => {
	return { type: CLEAR_MESSAGES };
};

export const updateFilters = (filters) => {
	return {
		type: UPDATE_FILTERS,
		filters: filters
	}
};