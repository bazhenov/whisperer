import { Set, List, Map } from 'immutable';

export const getGroupShortName = (message) => {
	const parts = (message.group || "").split('.');
	return parts.reduce((name, part, i) => {
		if (part.length === 0) return name;
		return name + (name.length === 0 ? '' : '.') + (i === (parts.length - 1) ? part : part[0])
	}, '');
};

export const isMessageSuitedForFilters = (m, filters) => {
	if (!(filters.packageNames.isEmpty() || filters.packageNames.contains(getGroupShortName(m)))) return false;
	if (!(filters.hostNames.isEmpty() || filters.hostNames.contains(m.host))) return false;
	return filters.threadNames.isEmpty() || filters.threadNames.contains(m.thread);
};

export const filterMessages = (messages, filters) => {
	return messages.filter(m => isMessageSuitedForFilters(m, filters));
};

export const emptyFilters = () => {
	return {
		packageNames: new Set(), hostNames: new Set(), threadNames: new Set()
	};
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
		packageNames: updateFilterValues('packageNames', getGroupShortName(message)),
		threadNames: updateFilterValues('threadNames', message.thread)
	};
};

export const createFiltersValues = (all, filters) => {
	return all.reduce((filtersValues, m) => updateFiltersValues(filtersValues, filters, m), emptyFilterValues());
};

export const emptyFilterValues = () => {
	return {
		hostNames: new Map(),
		packageNames: new Map(),
		threadNames: new Map()
	};
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