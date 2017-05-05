import React, { Component } from 'react'
import { SQUASHED_MESSAGE_ARGUMENT_LENGTH } from '../constants'

export default class MessageArgument extends Component {

	constructor(props) {
		super(props);
		this.state = { isOpened: false };
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		this.setState({ isOpened: true });
		e.preventDefault();
	}

	render() {
		const text = this.props.text;
		if (this.state.isOpened) return <span className="argument-value">{text}</span>;
		return <a href="#" onClick={this.handleClick}>{text.substring(0, SQUASHED_MESSAGE_ARGUMENT_LENGTH)}...</a>
	}
}
