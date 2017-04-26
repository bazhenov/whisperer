import React, { Component, PureComponent } from 'react'
import MessageRow from './MessageRow.jsx'

export default class Messages extends PureComponent {

	render() {
		const rows = this.props.messages.map((m, key) => {
			return <MessageRow message={m} key={key + '_' + m.timestamp} />
		});

		return <div className="row">
			<div className="col-md-12">
				{ rows }
			</div>
		</div>
	}
}
