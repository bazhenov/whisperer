import React from 'react'
import Message from './Message.jsx'

export default ({ messages }) =>
	<div className="row">
		<div className="col-md-12">
			{ messages.map((m, key) => <Message message={m} key={key + '_' + m.timestamp} />) }
		</div>
	</div>
