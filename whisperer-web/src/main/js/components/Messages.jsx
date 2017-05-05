import React from 'react'
import Message from './Message.jsx'

export default ({ messages }) =>
	<div>
		{ messages.map(m => <Message message={m} key={m.id} />) }
	</div>
