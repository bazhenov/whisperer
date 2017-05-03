import { getGroupShortName, isMessageSuitedForFilters, emptyFilters, buildFilters, filterMessages,
	buildFilterValues, updateFiltersValues, createFiltersValues } from '../utils'
import { Set, Map } from 'immutable'

const createMessage = (host, shortGroupName, thread) => {
	return { host, shortGroupName, thread};
};

it ('getGroupShortName', () => {
	expect(getGroupShortName('')).toBe('');
	expect(getGroupShortName('EngineContext')).toBe('EngineContext');
	expect(getGroupShortName('com.farpost.search.EngineContext')).toBe('c.f.s.EngineContext');
});

it ('isMessageSuitedForFilters', () => {
	const message = {
		shortGroupName: 'c.f.s.SearchEngine',
		host: 'http://search-coord2.akod.loc',
		thread: 'qtp-123'
	};

	const shouldBeSuited = filters => expect(isMessageSuitedForFilters(message, filters)).toBeTruthy();
	const shouldNotBeSuited = filters => expect(isMessageSuitedForFilters(message, filters)).toBeFalsy();

	[
		emptyFilters(),
		buildFilters(Set(['http://search-coord2.akod.loc']), Set(['c.f.s.SearchEngine']), Set(['qtp-123']))
	].forEach(fs => shouldBeSuited(fs));

	[
		buildFilters(Set(['http://anotherHost']), Set(), Set()),
		buildFilters(Set(), Set(['another_package']), Set()),
		buildFilters(Set(), Set(), Set(['another_thread']))
	].forEach(fs => shouldNotBeSuited(fs));
});

it ('filterMessages', () => {


	const messages = [
		createMessage('http://search-coord2.akod.loc', 'c.f.s.SearchEngine', 'qtp-1'),
		createMessage('http://search-coord2.akod.loc', 'c.f.s.EngineContext', 'qtp-2'),
		createMessage('http://search-coord2.akod.loc', 'c.f.s.SearchEngine', 'qtp-3'),
		createMessage('http://search-coord3.akod.loc', '.f.s.EngineContext', 'qtp-1'),
		createMessage('http://search-coord3.akod.loc', 'c.f.s.SearchEngine', 'qtp-2'),
		createMessage('http://search-coord3.akod.loc', '.f.s.EngineContext', 'qtp-3'),
		createMessage('http://search-coord3.akod.loc', 'c.f.s.SearchEngine', 'qtp-1')
	];
	const filters = buildFilters(
		Set(['http://search-coord2.akod.loc']),
		Set(['c.f.s.SearchEngine', 'c.f.s.EngineContext']),
		Set(['qtp-1', 'qtp-2'])
	);
	const expectedMessages = [
		createMessage('http://search-coord2.akod.loc', 'c.f.s.SearchEngine', 'qtp-1'),
		createMessage('http://search-coord2.akod.loc', 'c.f.s.EngineContext', 'qtp-2'),
	];
	expect(filterMessages(messages, filters)).toEqual(expectedMessages);
});

it('updateFiltersValues', () => {
	const currentFilterValues = buildFilterValues(
		Map({'http://search-coord2.akod.loc': 0, 'http://search-coord3.akod.loc': 1}),
		Map({'c.f.s.EngineContext': 1}),
		Map({'qtp-2': 1, "qtp-3": 1})
	);
	const filters = buildFilters(
		Set(['http://search-coord2.akod.loc', 'http://search-coord3.akod.loc']),
		Set(['c.f.s.SearchEngine', 'c.f.s.EngineContext']),
		Set(['qtp-2', 'qtp-3'])
	);
	const message = createMessage('http://search-coord2.akod.loc', 'c.f.s.SearchEngine', 'qtp-3');
	const expectedFilterValues = buildFilterValues(
		Map({'http://search-coord2.akod.loc': 1, 'http://search-coord3.akod.loc': 1}),
		Map({'c.f.s.EngineContext': 1, 'c.f.s.SearchEngine': 1}),
		Map({'qtp-2': 1, "qtp-3": 2})
	);
	const newFilterValues = updateFiltersValues(currentFilterValues, filters, message);
	expect(newFilterValues).toEqual(expectedFilterValues);
});

it('createFiltersValues', () => {
	const messages = [createMessage('http://search-coord2.akod.loc', 'c.f.s.SearchEngine', 'qtp-1'),
		createMessage('http://search-coord2.akod.loc', 'c.f.s.EngineContext', 'qtp-2'),
		createMessage('http://search-coord2.akod.loc', 'c.f.s.SearchEngine', 'qtp-3'),
		createMessage('http://search-coord3.akod.loc', 'c.f.s.EngineContext', 'qtp-1'),
		createMessage('http://search-coord3.akod.loc', 'c.f.s.SearchEngine', 'qtp-2'),
		createMessage('http://search-coord3.akod.loc', 'c.f.s.EngineContext', 'qtp-3'),
		createMessage('http://search-coord3.akod.loc', 'c.f.s.SearchEngine', 'qtp-1')
	];
	const expectedFiltersValues = buildFilterValues(
		Map({'http://search-coord2.akod.loc': 3, 'http://search-coord3.akod.loc': 4}),
		Map({'c.f.s.SearchEngine': 4, 'c.f.s.EngineContext': 3}),
		Map({'qtp-1': 3, 'qtp-2': 2, "qtp-3": 2})
	);
	expect(createFiltersValues(messages, emptyFilters())).toEqual(expectedFiltersValues);
});
