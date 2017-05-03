import React from 'react'
import Message from './Message.jsx'

export default ({ messages }) =>
	<div className="row">
		<div className="col-md-12">
			{ messages.map(m => <Message message={m} key={m.id} />) }
		</div>
	</div>
