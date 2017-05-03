import { newConnectionParams } from '../utils'

export const connectionParams = newConnectionParams('clientId', 'some_ring', 'com.farpost.search','INFO');

export const message = {
	id: 1,
	args: [
		"StagedSearchQuery",
		"ftext contains('sdsdfsd') and origquery contains('sdsdfsd') and stat.searchDir='0' and cityId in ('1', '0')",
		null,
		"directoryId",
		"siteId!='1632' and type in ('advertBulletin', 'auction') and directoryId in ('0', '4', '500')"],
	message: "Delegating execution to command {}, query: '{}', sort: {}, facets: {}, filter: '{}'",
	timestamp: 1493266629683,
	group: "com.farpost.search.CoordinatorSearchEngine",
	shortGroupName: "c.f.s.CoordinatorSearchEngine",
	host: "http://search-coord5.akod.loc",
	thread: "qtp-12345"
};

export const message2 = {
	id: 2,
	args: ["+(+(+system.defined.attributes:siteId -siteId:1632)"],
	message: "Search issued: {}",
	timestamp: 1493266629708,
	group: "com.farpost.search.index.IndexNodeImpl",
	shortGroupName: "c.f.s.i.IndexNodeImpl",
	host: "http://search-node68.akod.loc",
	thread: "qtp1914572623-35"
};