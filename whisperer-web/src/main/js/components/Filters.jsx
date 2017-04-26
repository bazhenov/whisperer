import React, { Component } from 'react'
import { getGroupShortName } from '../utils'

export default class Filters extends Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.updateFiltersFilter = this.updateFiltersFilter.bind(this);
		this.state = {
			packageNameFilter: '',
			hostNameFilter: '',
			threadNameFilter: ''
		}
	}

	updateFiltersFilter(e) {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value
		})
	}

	handleChange(e) {
		const { filters, updateFilters } = this.props;
		const newFilters = { ...filters, [e.target.name]: e.target.value };
		updateFilters(newFilters);
	}

	_getPackageNames() {
		return this._getOptions(this.props.filtersValues.packageNames.toArray(), this.state.packageNameFilter);
	}

	_getOptions(values, filter) {
		values.sort();
		const optionsObjs = values
			.filter(v => filter.length === 0 || v.toLowerCase().indexOf(filter.toLowerCase()) > -1)
			.map(v => {
				return { title: v, value: v}
			});
		return [{ title: 'all', value: ''}].concat(optionsObjs);
	}

	_getHostNames() {
		return this._getOptions(this.props.filtersValues.hostNames.toArray(), this.state.hostNameFilter);
	}

	_getThreadNames() {
		return this._getOptions(this.props.filtersValues.threadNames.toArray(), this.state.threadNameFilter);
	}

	_getRadios(options, name) {
		const { filters } = this.props;
		const radios = options.map(radio => {
			return <div className="radio filters-radio" key={radio.value}>
				<label><input type="radio" name={name} onChange={this.handleChange} value={radio.value}
											checked={radio.value === filters[name]} />{radio.title}</label>
			</div>
		});
		return <div className="filters-filter-options">{radios}</div>
	}

	renderFilterFilter(label, name) {
		return <div className="form-group">
			<label htmlFor={name}>{label}</label>
			<input type="text" className="form-control" id={name} name={name} value={this.state[name]}
						 onChange={this.updateFiltersFilter} />
		</div>
	}

	render() {
		return <div>
			<h3>Filters</h3>
			<div className="row">
				<div className="col-xs-4">
					{this.renderFilterFilter('Package Name', 'packageNameFilter')}
					{this._getRadios(this._getPackageNames(), 'packageName')}
				</div>
				<div className="col-xs-4">
					{this.renderFilterFilter('Host Name', 'hostNameFilter')}
					{this._getRadios(this._getHostNames(), 'hostName')}
				</div>
				<div className="col-xs-4">
					{this.renderFilterFilter('Thread Name', 'threadNameFilter')}
					{this._getRadios(this._getThreadNames(), 'threadName')}
				</div>
			</div>
		</div>
	}
}