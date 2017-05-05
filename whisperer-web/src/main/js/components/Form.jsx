import React, {Component} from 'react';

export default class Form extends Component {

	constructor(props) {
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(e) {
		this.props.updateCurrentConnectionParams(e.target.name, e.target.value);
	}

	render() {
		const { isListening, connectionParams, startListening, stopListening } = this.props;
		return <div className="well">
			<form onSubmit={(e) => e.preventDefault()} >
				<fieldset disabled={isListening}>
					<div className="form-group">
						<label htmlFor="mdcKeyInput">MDC key name</label>
						<input type="text" name="key" onChange={this.handleInputChange} className="form-control"
									 id="mdcKeyInput" value={connectionParams.key} />
					</div>
					<div className="form-group">
						<label htmlFor="mdcValueInput">Expected value</label>
						<input type="text" name="value" onChange={this.handleInputChange} className="form-control"
									 id="mdcValueInput" value={connectionParams.value} />
					</div>
					<div className="form-group" id="log-prefix-input-div">
						<label htmlFor="logPrefixInput">Log prefix</label>
						<input type="text" name="prefix" onChange={this.handleInputChange} className="form-control"
									 id="logPrefixInput" value={connectionParams.prefix} />
					</div>
					<div className="form-group" id="severity-input-div">
						<label htmlFor="severityInput">Severity</label>
						<select className="form-control" id="severityInput" value={connectionParams.severity} name="severity"
										onChange={this.handleInputChange}>
							<option value="TRACE">TRACE</option>
							<option value="DEBUG">DEBUG</option>
							<option value="INFO">INFO</option>
							<option value="WARN">WARN</option>
							<option value="ERROR">ERROR</option>
						</select>
					</div>
				</fieldset>
			</form>
			{isListening ?
				<a href="#" onClick={(e) => { stopListening(); e.preventDefault() }} className="connection-form-button btn btn-danger">STOP</a> :
				<a href="#" onClick={(e) => { startListening(); e.preventDefault() }} className="connection-form-button btn btn-success">LISTEN</a>}
		</div>
	}
}