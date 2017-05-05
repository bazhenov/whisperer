import React, {Component} from 'react';
import Form from './Form.jsx'
import Messages from './Messages.jsx'
import Filters from './Filters.jsx';
import MessagesCount from './MessagesCount.jsx';
import ToManyMessagesAlert from './ToManyMessagesAlert.jsx'
import { connect } from "react-redux";
import {
	startListening,
	stopListening,
	updateConnectionParams,
	loadConnectionParams,
	connectToSSE,
	disconnectFromSSE,
	clearMessages,
	updateFilters
} from '../actions';
import { MAX_MESSAGES_TO_DISPLAY } from '../constants';

export class App extends Component {

	constructor(props) {
		super(props);
		this.state = App._stateFromProps(props);
		this.updateCurrentConnectionParams = this.updateCurrentConnectionParams.bind(this);
		this.handleStartListening = this.handleStartListening.bind(this);
	}

	static _stateFromProps(props) {
		return {
			currentConnectionParams: { ...props.connectionParams }
		};
	}

	updateCurrentConnectionParams(key, value) {
		const newState = { ...this.state };
		newState.currentConnectionParams[key] = value;
		this.setState(newState);
	}

	componentWillReceiveProps(props) {
		const newConnectionParams = App._stateFromProps(props);
		if (!(Object.is(this.state.currentConnectionParams, newConnectionParams))) {
			this.setState(newConnectionParams);
		}
	}

	componentDidMount() {
		const { loadConnectionParams } = this.props;
		loadConnectionParams();
	}

	handleStartListening() {
		this.props.startListening(this.state.currentConnectionParams);
	}

	render() {
		const {
			stopListening,
			clearMessages,
			isListening,
			messages,
			updateFilters
		} = this.props;
		const { all, filtered, filters, filtersValues } = messages;
		const totalMessages = all.size;
		const filteredCount = filtered.size;

		const messagesToDisplay = filtered.slice(0, MAX_MESSAGES_TO_DISPLAY);

		return <div>
			<div className="row">
				<div className="col-md-3">
					<Form updateCurrentConnectionParams={this.updateCurrentConnectionParams} isListening={isListening}
								connectionParams={this.state.currentConnectionParams} stopListening={stopListening}
								startListening={this.handleStartListening} />
				</div>
				<div className="col-md-9">
					<Filters filters={filters} updateFilters={updateFilters} filtersValues={filtersValues} />
				</div>
			</div>

			<div className="row">
				<div className="col-md-12">
					<div className="messages">
						<MessagesCount totalCount={totalMessages} clearMessages={clearMessages} filteredCount={filteredCount} />
						<Messages messages={messagesToDisplay} />
						<ToManyMessagesAlert filteredCount={filteredCount} />
					</div>
				</div>
			</div>
		</div>;
	}
}

const mapStateToProps = (state) => {
	return {...state};
};

const mapDispatchToProps = (dispatch) => {
	return {
		startListening: (connectionParams) => {
			dispatch(
				updateConnectionParams(connectionParams)
			);
			dispatch(startListening());
			dispatch(connectToSSE())
		},
		stopListening: () => {
			dispatch(stopListening());
			dispatch(disconnectFromSSE());
		},
		loadConnectionParams: () => {
			dispatch(loadConnectionParams())
		},
		clearMessages: () => {
			dispatch(clearMessages());
		},
		updateFilters: (filters) => {
			dispatch(updateFilters(filters));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);