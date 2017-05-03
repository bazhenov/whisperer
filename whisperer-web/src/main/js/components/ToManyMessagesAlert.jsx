import React from "react";
import { MAX_MESSAGES_TO_DISPLAY } from '../constants'

export default ({ filteredCount }) => {
	if (filteredCount < MAX_MESSAGES_TO_DISPLAY) return null;
	return <div className="row">
		<div className="col-md-12">
			<div className="alert alert-warning" role="alert">
				Too many messages! Only first {MAX_MESSAGES_TO_DISPLAY} was showed.
			</div>
		</div>
	</div>
}