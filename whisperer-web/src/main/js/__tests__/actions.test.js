import * as actions from '../actions';
import { connectionParams, message } from './fixtures'
import { emptyFilters } from '../utils'
import { Map, List } from 'immutable'
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { SSE_RECONNECT_TIMEOUT } from '../constants';
import * as constants from '../constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {

	describe('connection params', () => {

		it('setConnectionParams', () => {
			expect(actions.setConnectionParams(connectionParams)).toEqual({
				type: actions.SET_CONNECTION_PARAMS,
				connectionParams: connectionParams
			});
		});

		it('should store connection params in localstorage', () => {
			const store = mockStore();
			let expectedActions = [];

			store.dispatch(actions.loadConnectionParams());
			expect(store.getActions()).toEqual(expectedActions);

			expectedActions = [ ...expectedActions, actions.setConnectionParams(connectionParams) ];
			store.dispatch(actions.updateConnectionParams(connectionParams));
			expect(store.getActions()).toEqual(expectedActions);

			// second setConnectionParams action will be fired because now we have connection params in localstorage
			expectedActions = [ ...expectedActions, actions.setConnectionParams(connectionParams) ];
			store.dispatch(actions.loadConnectionParams(connectionParams));
			expect(store.getActions()).toEqual(expectedActions);
		});
	});

	describe('operating with sse', () => {

		it('disconnectFromSSE', () => {
			const sseConnection = { close: jest.fn() };
			const store = mockStore({ sseConnection });

			store.dispatch(actions.disconnectFromSSE());

			expect(sseConnection.close).toBeCalled();
			expect(store.getActions()).toEqual([actions.setSSEConnection(null)]);
		});

		describe('connect to sse', () => {
			const eventSourceInterceptor = { };
			global.EventSource = class {
				constructor(url) {
					this.url = url;
					eventSourceInterceptor.eventSource = this;
					this.listeners = Map();
					this.isClosed = false;
				}

				addEventListener(event, func) {
					this.listeners = this.listeners.set(event, func);
				}

				close() {
					this.isClosed = true;
				}
			};

			let state;
			let store;
			let eventSource;
			beforeEach(() => {
				// connection will be opened only if isListening === false и eventSource === null
				state = {
					isListening: true,
					sseConnection: null,
					connectionParams: connectionParams
				};
				store = mockStore(() => state);
				store.dispatch(actions.connectToSSE());
				eventSource = eventSourceInterceptor.eventSource;
			});

			it('eventSource should be defined', () => {
				expect(eventSource).toBeDefined();
			});

			it('check url', () => {
				expect(eventSource.url).toBe('/stream?k=clientId&level=INFO&prefix=com.farpost.search&v=some_ring');
			});

			it('setSSEConnection should be triggered', () => {
				expect(store.getActions()).toEqual([actions.setSSEConnection(eventSource)]);
			});

			describe('onerror', () => {
				let onerror;
				beforeEach(() => {
					onerror = eventSource.onerror;
				});
				it('is defined', () => {
					expect(onerror).toBeDefined()
				});
				it('should close connection', () => {
					expect(eventSource.isClosed).toBeFalsy();
					onerror();
					expect(eventSource.isClosed).toBeTruthy();
				});
				it('should create new connection after timeout', () => {
					const timeoutInterceptor = {};
					global.setTimeout = (timeoutFunc, timeout) => {
						timeoutInterceptor.timeoutFunc= timeoutFunc;
						timeoutInterceptor.timeout = timeout;
					};
					onerror();
					const { timeoutFunc, timeout } = timeoutInterceptor;
					expect(timeout).toBe(SSE_RECONNECT_TIMEOUT);
					expect(timeoutFunc).toBeDefined();
					timeoutFunc();
					expect(eventSourceInterceptor.eventSource).not.toBe(eventSource);
				});
			});

			describe('on message', () => {
				const originalMaxMessagesCount = constants.MAX_MESSAGES_COUNT;
				let onMessageHandler;
				beforeEach(() => {
					onMessageHandler = eventSource.listeners.get('log');
					state.messages = {all: List()};
				});
				it('receive message', () => {
					let expectedActions = [ ...store.getActions(), actions.receiveMessage(message) ];
					onMessageHandler({data: JSON.stringify(message)});
					expect(store.getActions()).toEqual(expectedActions);
				});
				it('stop on overflow', () => {
					let expectedActions = [ ...store.getActions(), actions.stopListening(), actions.setSSEConnection(null) ];
					constants.MAX_MESSAGES_COUNT = 0;
					expect(eventSource.isClosed).toBeFalsy();
					onMessageHandler({data: JSON.stringify(message)});
					expect(eventSource.isClosed).toBeTruthy();
					expect(store.getActions()).toEqual(expectedActions);
				});

				afterEach(() => {
					constants.MAX_MESSAGES_COUNT = originalMaxMessagesCount;
				});
			});
		});
	});

	it('receiveMessage', () => {
		expect(actions.receiveMessage(message)).toEqual({
			type: actions.MESSAGE_RECEIVED,
			message: message
		});
	});

	it('startListening', () => {
		expect(actions.startListening()).toEqual({
			type: actions.START_LISTENING
		});
	});

	it('stopListening', () => {
		expect(actions.stopListening()).toEqual({
			type: actions.STOP_LISTENING
		});
	});

	it('setSSEConnection', () => {
		const sseConnection = 'a\'m not a really sse connection, but who cares?';
		expect(actions.setSSEConnection(sseConnection)).toEqual({
			type: actions.SET_SSE_CONNECTION,
			connection: sseConnection
		});
	});

	it('clearMessages', () => {
		expect(actions.clearMessages()).toEqual({
			type: actions.CLEAR_MESSAGES
		});
	});

	it('updateFilters', () => {
		const filters = emptyFilters();
		expect(actions.updateFilters(filters)).toEqual({
			type: actions.UPDATE_FILTERS,
			filters: filters
		});
	});
});