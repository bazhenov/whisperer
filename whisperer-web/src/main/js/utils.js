import { Set } from 'immutable';

export const getGroupShortName = (message) => {
	return (message.group || "").split('.').slice(-1)[0];
};

export const filterMessages = (messages, filter) => {
	return messages.filter(m => {
		if (filter.packageName !== '' && getGroupShortName(m) !== filter.packageName) return false;
		if (filter.hostName !== '' && m.host !== filter.hostName) return false;
		return !(filter.threadName !== '' && m.thread !== filter.threadName);
	});
};

export const emptyFilter = () => {
	return {
		packageName: '', hostName: '', threadName: ''
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

export const updateFilterValues = (currentValues, message) => {
	return {
		hostNames: currentValues.hostNames.add(message.host),
		packageNames: currentValues.packageNames.add(getGroupShortName(message)),
		threadNames: currentValues.threadNames.add(message.thread)
	}
};

export const emptyFilterValues = () => {
	return {
		hostNames: new Set(),
		packageNames: new Set(),
		threadNames: new Set()
	};
};

export const isFiltersValuesChanged = (old, newValues) => {
	return newValues.hostNames.size !== old.hostNames.size ||
		newValues.packageNames.size !== old.packageNames.size ||
		newValues.threadNames.size !== old.threadNames.size;
};