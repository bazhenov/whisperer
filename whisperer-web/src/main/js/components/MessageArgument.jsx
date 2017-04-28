import React, { Component } from 'react'

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
		if (this.state.isOpened) return <span>{this.props.text}</span>;
		return <a href="#" onClick={this.handleClick}>{"{"}...{"}"}</a>
	}
}
