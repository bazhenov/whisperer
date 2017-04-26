import React, { Component } from 'react'
import { getGroupShortName } from '../utils'
// import ReactTooltip from 'react-tooltip'
import moment from 'moment'

const MAX_HEIGHT = 88;

export default class MessageRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			jammed: true
		};
		this.toggleJammed = this.toggleJammed.bind(this);
	}

	componentDidMount() {
		if (this.refs.messageBlock.clientHeight >= MAX_HEIGHT) {
			this.refs.jammedToggle.className = 'message-block-toggle-jammed';
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.jammed !== nextState.jammed;
	}

	toggleJammed(e) {
		this.setState({
			jammed: !this.state.jammed
		});
		e.preventDefault();
	}

	render() {
		const { message } = this.props;
		const { jammed } = this.state;
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
						<div className="message-group-name">{getGroupShortName(message)}</div>
						<span className="message-tooltip-text">{message.group}</span>
					</div>
				</div>
				<div className="message-thread-name">
					thread: {message.thread}
				</div>
			</div>
			<div className="col-xs-9 message-row-right-col">
				<div className={'message-block' + (jammed ? ' message-block-jammed' : '')} ref="messageBlock">
					{ jammed ? message.message.substring(0, 700) : message.message }
				</div>
				<div style={ { position: 'relative' } } className="message-block-toggle-jammed hidden" ref="jammedToggle">
					<a href="#" onClick={this.toggleJammed}>
						<span className={'glyphicon glyphicon glyphicon-menu-' + (jammed ? 'down' : 'up')} aria-hidden="true" />
					</a>
				</div>
			</div>
		</div>
	}
}