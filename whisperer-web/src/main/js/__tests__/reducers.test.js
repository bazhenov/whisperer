import rootReducer from "../reducers";
import * as actions from "../actions";
import { List, Set, Map } from 'immutable';
import { emptyConnectionParams, emptyMessages, emptyFilterValues, newConnectionParams,
	getGroupShortName, buildFilterValues } from '../utils'
import * as constants from '../constants';

describe('root reducer', () => {
	const initialState = rootReducer(undefined, {});

	it('should return the initial state', () => {
		expect(initialState).toEqual({
			isListening: false,
			connectionParams: emptyConnectionParams(),
			messages: emptyMessages(),
			sseConnection: null
		});
	});

	it('should be able to toggle isListening', () => {
		let state = rootReducer(initialState, actions.startListening());
		expect(state.isListening).toBeTruthy();
		state = rootReducer(initialState, actions.stopListening());
		expect(state.isListening).toBeFalsy();
	});

	it('should set connection params', () => {
		const connectionParams = newConnectionParams('clientId', 'some_ring', 'com.farpost.search', 'INFO');
		const state = rootReducer(initialState, actions.setConnectionParams(connectionParams));
		expect(state.connectionParams).toEqual(connectionParams);
	});

	it('should set sse connection', () => {
		const sseConnection = 'lets pretend that it is real sse connecton';
		const state = rootReducer(initialState, actions.setSSEConnection(sseConnection));
		expect(state.sseConnection).toEqual(sseConnection);
	});

	describe('message and filters processing', () => {
		const message = {
			group: 'com.farpost.search.SearchEngine',
			host: 'http://search-coord2.akod.loc',
			thread: 'qtp-123'
		};
		const message2 = {
			group: 'com.farpost.search.SearchEngine',
			host: 'http://search-coord3.akod.loc',
			thread: 'qtp-123'
		};
		const message3 = {
			group: 'org.springframework.web.client.RestTemplate',
			host: 'http://search-coord2.akod.loc',
			thread: 'another-thread'
		};
		const filters = {
			packageNames: Set(['c.f.s.SearchEngine']),
			hostNames: Set(['http://search-coord2.akod.loc']),
			threadNames: Set(['qtp-123'])
		};
		const originalMaxMessagesCount = constants.MAX_MESSAGES_COUNT;

		it('should enrich message and add it to all', () => {
			const shortGroupName = getGroupShortName(message.group);
			const enrichedMessage = { ...message, id: 1, shortGroupName: shortGroupName };
			// to be sure that id is autoincremented
			const enrichedMessage2 = { ...message2, id: 2, shortGroupName: shortGroupName };

			expect(initialState.messages.nextMessageId).toEqual(1);

			let state = rootReducer(initialState, actions.receiveMessage(message));
			expect(state.messages.all).toEqual(List([enrichedMessage]));
			expect(state.messages.nextMessageId).toEqual(2);

			state = rootReducer(state, actions.receiveMessage(message2));
			expect(state.messages.all).toEqual(List([enrichedMessage, enrichedMessage2]));
			expect(state.messages.nextMessageId).toEqual(3);
		});

		describe('filtering', () => {
			it('filtered should be equals all if state does not have filter', () => {
				let state = rootReducer(initialState, actions.receiveMessage(message));
				expect(state.messages.all).toEqual(state.messages.filtered);
				state = rootReducer(state, actions.receiveMessage(message));
				expect(state.messages.all).toEqual(state.messages.filtered);
			});

			it('should gather filter values', () => {
				let state = initialState;
				expect(state.messages.filtersValues).toEqual(emptyFilterValues());

				state = rootReducer(state, actions.receiveMessage(message));
				expect(state.messages.filtersValues).toEqual(
					buildFilterValues(
						Map({'http://search-coord2.akod.loc': 1}),
						Map({'c.f.s.SearchEngine': 1}),
						Map({'qtp-123': 1}),
					)
				);

				state = rootReducer(state, actions.receiveMessage(message2));
				expect(state.messages.filtersValues).toEqual(
					buildFilterValues(
						Map({ 'http://search-coord2.akod.loc': 1, 'http://search-coord3.akod.loc': 1 }),
						Map({ 'c.f.s.SearchEngine': 2 }),
						Map({ 'qtp-123': 2 }),
					)
				);

				state = rootReducer(state, actions.receiveMessage(message3));
				expect(state.messages.filtersValues).toEqual(
					buildFilterValues(
						Map({ 'http://search-coord2.akod.loc': 2, 'http://search-coord3.akod.loc': 1 }),
						Map({ 'c.f.s.SearchEngine': 2, 'o.s.w.c.RestTemplate': 1 }),
						Map({ 'qtp-123': 2, 'another-thread': 1 }),
					)
				);
			});

			it('should update filters values and filtered message on filter update', () => {
				const enrichedMessage = { ...message, id: 1, shortGroupName: getGroupShortName(message.group) };
				const state = [message, message2, message3].reduce(
					(currentState, message) => rootReducer(currentState, actions.receiveMessage(message)),
					initialState
				);

				expect(rootReducer(state, actions.updateFilters(filters)).messages).toEqual({
					...state.messages,
					filters: filters,
					filtered: List([enrichedMessage]),
					filtersValues: buildFilterValues(
						Map({ 'http://search-coord2.akod.loc': 1, 'http://search-coord3.akod.loc': 1 }),
						Map({ 'c.f.s.SearchEngine': 1, 'o.s.w.c.RestTemplate': 0 }),
						Map({ 'qtp-123': 1, 'another-thread': 0 })
					)
				});
			});
		});

		it('should wipe all on clear messages except nextMessageId', () => {
			let state = rootReducer(initialState, actions.receiveMessage(message));
			state = rootReducer(state, actions.receiveMessage(message));
			const currentNextMessageId = state.nextMessageId;
			state = rootReducer(state, actions.updateFilters(filters));
			expect(state).toEqual({ ...state, nextMessageId: currentNextMessageId });
		});

		it('should not change state if messages limit reached', () => {
			constants.MAX_MESSAGES_COUNT = 1;
			let state = rootReducer(initialState, actions.receiveMessage(message));
			expect(rootReducer(state, actions.receiveMessage(message))).toEqual(state);
		});

		afterEach(() => {
			constants.MAX_MESSAGES_COUNT = originalMaxMessagesCount;
		});
	});
});