import { Set, List, Map } from 'immutable';

export const getGroupShortName = (group) => {
	const parts = (group || '').split('.');
	return parts.reduce((name, part, i) => {
		if (part.length === 0) return name;
		return name + (name.length === 0 ? '' : '.') + (i === (parts.length - 1) ? part : part[0])
	}, '');
};

const isEmptyOrContains = (col, value) => {
	return col.isEmpty() || col.contains(value);
};

export const isMessageSuitedForFilters = (m, filters) => {
	return isEmptyOrContains(filters.packageNames, m.shortGroupName) &&
		isEmptyOrContains(filters.hostNames, m.host) &&
		isEmptyOrContains(filters.threadNames, m.thread);
};

export const filterMessages = (messages, filters) => {
	return messages.filter(m => isMessageSuitedForFilters(m, filters));
};

export const emptyFilters = () => {
	return buildFilters(Set(), Set(), Set());
};

export const buildFilters = (hostNames, packageNames, threadNames) => {
	return { hostNames, packageNames, threadNames };
};

export const emptyConnectionParams = () => {
	return {
		key: '', value: '', prefix: '', severity: 'INFO'
	};
};

export const newConnectionParams = (key, value, prefix, severity) => {
	return { key, value, prefix, severity };
};

export const updateFiltersValues = (current, filters, message) => {

	const updateFilterValues = (name, value) => {
		let res = current[name];
		if (isMessageSuitedForFilters(message, { ...filters, [name]: new Set() })) {
			res = res.update(value, 0, v => v + 1);
		}
		res = res.has(value) ? res : res.set(value, 0);
		return res;
	};
	return {
		hostNames: updateFilterValues('hostNames', message.host),
		packageNames: updateFilterValues('packageNames', message.shortGroupName),
		threadNames: updateFilterValues('threadNames', message.thread)
	};
};

export const createFiltersValues = (all, filters) => {
	return all.reduce((filtersValues, m) => updateFiltersValues(filtersValues, filters, m), emptyFilterValues());
};

export const emptyFilterValues = () => {
	return buildFilterValues(Map(), Map(), Map());
};

export const buildFilterValues = (hostNames, packageNames, threadNames) => {
	return { hostNames, packageNames, threadNames };
};

export const emptyMessages = () => {
	return {
		all: new List(),
		filtered: new List(),
		filters: emptyFilters(),
		filtersValues: emptyFilterValues(),
		nextMessageId: 1
	}
};