import React, { Component } from 'react'
import moment from 'moment'
import MessageArgument from './MessageArgument.jsx';

export default class Message extends Component {

	shouldComponentUpdate() {
		return false;
	}

	render() {
		const { message } = this.props;
		const args = message.args || [];
		const textParts = message.message.split('{}').reduce((values, part, i) => {
			values.push(<span key={'p' + i}>{part}</span>);
			if (i < args.length) {
				const arg = String(args[i]);
				const key = 'a' + i;
				const argumentEl = arg.length < 10 ? <span key={key}>{arg}</span> :
					<MessageArgument key={key} text={arg} />;
				values.push(argumentEl);
			}
			return values;
		}, []);

		return <div className="row message-row">
			<div className="col-xs-3 message-row-left-col">
				<div>
					<small>{moment(message.timestamp).format("HH:mm:ss.SSS")}</small>
				</div>
				<div className="message-host-name">
					<strong>{message.host}</strong>
				</div>
				<div>
					<div className="message-tooltip">
						<div className="message-group-name">{message.shortGroupName}</div>
						<span className="message-tooltip-text">{message.group}</span>
					</div>
				</div>
				<div className="message-thread-name">
					thread: {message.thread}
				</div>
			</div>
			<div className="col-xs-9 message-row-right-col">
				<div className="message-block">
					{ textParts }
				</div>
			</div>
		</div>
	}
}