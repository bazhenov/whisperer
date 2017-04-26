import React from 'react'

export default ({ totalCount, filteredCount }) => {
	if (totalCount === 0) return null;
	return <div id="messages-records-count">
		<strong>{filteredCount}</strong>{filteredCount !== totalCount ? ' (' + totalCount + ')' : ''} records
	</div>;
};