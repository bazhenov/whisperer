import React, {Component} from 'react';
import SeverityFilter from "./SeverityFilter.jsx";

export default class Form extends Component {

	constructor(props) {
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.updateSeverity = this.updateSeverity.bind(this);
	}

	handleInputChange(e) {
		this.props.updateCurrentConnectionParams(e.target.name, e.target.value);
	}

	updateSeverity(severity) {
		this.props.updateCurrentConnectionParams('severity', severity);
	}

	render() {
		const { isListening, connectionParams } = this.props;
		return <div>
			<h3>Connection parameters</h3>
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
					<div className="form-group">
						<label htmlFor="logPrefixInput">Log prefix</label>
						<input type="text" name="prefix" onChange={this.handleInputChange} className="form-control"
									 id="logPrefixInput" value={connectionParams.prefix} />
					</div>
				</fieldset>
				<SeverityFilter currentSeverity={connectionParams.severity} updateSeverity={this.updateSeverity}
												disabled={isListening} />
			</form>
		</div>
	}
}