import React, { Component } from 'react'

export default class Filters extends Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.updateFiltersFilter = this.updateFiltersFilter.bind(this);
		this.removeFilterHandler = this.removeFilterHandler.bind(this);
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

	removeFilterHandler(name, value, e) {
		this.removeFilter(name, value);
		e.preventDefault();
	}

	removeFilter(name, value) {
		const { filters, updateFilters } = this.props;
		const newFilters = { ...filters, [name]: filters[name].delete(value) };
		updateFilters(newFilters);
	}

	addFilter(name, value) {
		const { filters, updateFilters } = this.props;
		const newFilters = { ...filters, [name]: filters[name].add(value) };
		updateFilters(newFilters);
	}

	handleChange(e) {
		const { name, value, checked } = e.target;
		checked ? this.addFilter(name, value) : this.removeFilter(name, value);
	}

	_getOptions(values, filter) {
		return values.sortBy(
			(k, v) => {return {count: k, value: v}},
			(a, b) => {
				if (a.count === 0 && b.count > 0) return 1;
				if (a.count > 0 && b.count === 0) return -1;
				return a.value.localeCompare(b.value);
			}).filter((k, v) => filter.length === 0 || v.toLowerCase().indexOf(filter.toLowerCase()) > -1);
	}

	_getCheckboxes(options, name) {
		const { filters } = this.props;
		const checkboxes = options.map((count, value) => {
			return <div className="checkbox filters-checkbox" key={value}>
				<label className={count === 0 ? 'zero-count-filter' : ''}>
					<input type="checkbox" name={name} onChange={this.handleChange} value={value}
											checked={filters[name].contains(value)} />{value}
				</label>
				<div className="filters-count">
					<span className="filter-count-label">{count}</span>
				</div>
			</div>
		}).toArray();
		return <div className="filters-filter-options">{checkboxes}</div>
	}

	renderFilterFilter(label, name) {
		return <div className="form-group">
			<label htmlFor={name}>{label}</label>
			<input type="text" className="form-control" id={name} name={name} value={this.state[name]}
						 onChange={this.updateFiltersFilter} />
		</div>
	}

	_filtersIsEmpty() {
		const { packageNames, hostNames, threadNames } = this.props.filtersValues;
		return packageNames.isEmpty() && hostNames.isEmpty() && threadNames.isEmpty();
	}

	_filtersLabels(name) {
		const currentFilter = this.props.filters[name];
		if (currentFilter.isEmpty()) return null;
		const labels = currentFilter.map(v =>
			<div key={v}>
					<span className="filter-label-to-remove label label-info">
						<a type="button" onClick={e => this.removeFilterHandler(name, v, e)} className="close remove-filter">
							<span aria-hidden="true">&times;</span>
						</a>
						{v}
					</span>
			</div>
		);
		return <div className="filter-labels">{ labels }</div>;
	}

	renderFilter(label, filterName, field) {
		const options = this._getOptions(this.props.filtersValues[field], this.state[filterName]);
		return <div className="col-xs-4">
			{this.renderFilterFilter(label, filterName)}
			{this._getCheckboxes(options, field)}
			{this._filtersLabels(field)}
		</div>
	}

	render() {
		if (this._filtersIsEmpty()) return null;
		return <div className="well" id="filters">
			<div className="row">
				{this.renderFilter('Package Name', 'packageNameFilter', 'packageNames')}
				{this.renderFilter('Host Name', 'hostNameFilter', 'hostNames')}
				{this.renderFilter('Thread Name', 'threadNameFilter', 'threadNames')}
			</div>
		</div>
	}
}