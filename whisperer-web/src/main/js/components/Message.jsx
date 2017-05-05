import React, { Component } from 'react'
import moment from 'moment'
import MessageArgument from './MessageArgument.jsx';
import { SQUASHED_MESSAGE_ARGUMENT_LENGTH } from '../constants'

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
				const argumentEl = arg.length <= SQUASHED_MESSAGE_ARGUMENT_LENGTH ? <span className="argument-value" key={key}>{arg}</span> :
					<MessageArgument key={key} text={arg} />;
				values.push(argumentEl);
			}
			return values;
		}, []);

		return <div className="message-row">
			<div className="message-head">
				<div className="message-time">{moment(message.timestamp).format("HH:mm:ss.SSS")}</div>
				<div className="message-host">@{message.host}</div>
				<div className="message-group">
					<div className="message-tooltip">
						<div>{message.shortGroupName}</div>
						<span className="message-tooltip-text">{message.group}</span>
					</div>
				</div>
				<div className="message-thread">{message.thread}</div>
			</div>
			<div className="message-content">{ textParts }</div>
		</div>
	}
}