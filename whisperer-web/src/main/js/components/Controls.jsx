import React from 'react'

const Controls = (props) => {
	const { isListening, startListening, stopListening, clearMessages, hasMessages } = props;

	return <div id="control-buttons">
		{isListening ?
			<a href="#" onClick={(e) => { stopListening(); e.preventDefault() }} className="btn btn-default">STOP</a> :
			<a href="#" onClick={(e) => { startListening(); e.preventDefault() }} className="btn btn-default">LISTEN</a>}
		{hasMessages ?
			<a href="#" onClick={(e) => { clearMessages(); e.preventDefault() }} className="btn btn-danger">CLEAR</a> :
			''
		}
	</div>
};

export default Controls;