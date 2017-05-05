import React from 'react'

export default ({ totalCount, filteredCount, clearMessages }) => {
	if (totalCount === 0) return null;
	return <div id="messages-records-count">
		<strong>{filteredCount}{filteredCount !== totalCount ? ' (' + totalCount + ')' : ''} records</strong>
		<a href="#" onClick={(e) => { clearMessages(); e.preventDefault() }} id="messages-clear-button" className="btn btn-danger">CLEAR</a>
	</div>;
};