import React, {Component} from "react";

const SeverityVariant = ({title, isSelected, clickHandler, disabled }) => {
	return isSelected ? <span className="choosed-severity label label-primary">{title}</span> :
		disabled ? <span className="severity-button">{title}</span> :
			<a className="severity-button" onClick={clickHandler} href="#">{title}</a>
};

export default class SeverityFilter extends Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		e.preventDefault();
		this.props.updateSeverity(
			e.target.text
		)
	}

	render() {
		const { currentSeverity, disabled } = this.props;
		const buttons = ['INFO', 'WARN', 'ERROR', 'DEBUG', 'TRACE'].map(severity => {
			return <SeverityVariant key={severity}
															clickHandler={this.handleClick}
															title={severity}
															isSelected={currentSeverity === severity}
															disabled={disabled} />
		});
		return <div className="form-group">
			<div><label>Severity</label></div>
			{ buttons }
		</div>
	}
}