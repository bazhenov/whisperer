import React from "react";
import { App } from "../../components/App.jsx";
import renderer from "react-test-renderer";
import { connectionParams, message, message2 } from '../fixtures';
import { buildFilters, buildFilterValues } from '../../utils'
import { Set, Map } from 'immutable'
import * as constants from '../../constants'

describe('App', () => {
	const originalMaxMessagesCount = constants.MAX_MESSAGES_COUNT;

	const props = {
		isListening: true,
		connectionParams: connectionParams,
		messages: {
			all: [message, message2],
			filtered: [message],
			filters: buildFilters(
				Set(['http://search-coord5.akod.loc', 'http://search-coord4.akod.loc']),
				Set(['c.f.s.CoordinatorSearchEngine']),
				Set(['qtp-12345', 'qtp-23456']),
			),
			filtersValues: buildFilterValues(
				Map({'http://search-coord5.akod.loc': 5, 'http://search-coord4.akod.loc': 4, 'http://search-node68.akod.loc': 3}),
				Map({'c.f.s.CoordinatorSearchEngine': 5, 'c.f.s.i.IndexNodeImpl': 2}),
				Map({'qtp-12345':6, 'qtp-23456':5, 'qtp1914572623-35': 4, 'another-th': 0})
			)
		},
		loadConnectionParams: () => {}
	};

	it('regular', () => {
		expect(renderer.create(
			<App { ...props } />
		).toJSON()).toMatchSnapshot();
	});
	it('to many message to display', () => {
		constants.MAX_MESSAGES_COUNT = 1;
		expect(renderer.create(
			<App { ...props } filtered={[message, message2]} />
		).toJSON()).toMatchSnapshot();
	});
	afterEach(() => {
		constants.MAX_MESSAGES_COUNT = originalMaxMessagesCount;
	});
});