/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 22/12/15
 * Time: 17:12
 * To change this template use File | Settings | File Templates.
 */

define(
	['underscore', 'backbone', 'Filter'],
	function (_, Backbone, Filter) {

		function FilterCollection(metaForFilters) {
			this.metaForFilters = metaForFilters;
			this.filters = [];
			this.el = document.querySelector('.' + this.CSS_CLASSES.TABS);

			this.init();
		}

		_.extend(FilterCollection.prototype, Backbone.Events, {
			CSS_CLASSES: {
				TABS: 'whisperer__feed__filters',
				STATE_IS_ACTIVE: 'whisperer__feed__filters--is-active',
				TOGGLE: 'whisperer__feed__filters__toggle'
			},

			init: function () {
				var filter;

				this.metaForFilters.forEach((function (filterMeta) {
					this.filters.push(filter = new Filter(filterMeta.name, filterMeta.title));
					this.listenTo(filter, 'select-option.filter', this.selectOption_);
				}).bind(this));

				this.el.querySelector('.' + this.CSS_CLASSES.TOGGLE).addEventListener('change', this.toggleFilters_.bind(this));
			},

			render: function () {
				this.clear();
				this.filters.forEach(function (filter) {
					filter.getView().classList.add('mdl-cell--3-col');
					this.el.querySelector('.mdl-grid').appendChild(filter.getView());
				}, this);
			},

			show: function () {
				this.el.classList.add(this.CSS_CLASSES.STATE_IS_ACTIVE);
			},

			clear: function () {
				this.filters.forEach(function (filter) {
					filter.getView().parentNode.removeChild(filter.getView());
				});
			},

			clearOptions: function () {
				var toggleEl = this.el.querySelector('.' + this.CSS_CLASSES.TOGGLE);

				if (toggleEl.checked) {
					this.el.querySelector('.' + this.CSS_CLASSES.TOGGLE).click();
				}

				toggleEl.setAttribute('disabled', 'disabled');

				this.filters.forEach(function (filter) {
					filter.clearOptions();
				}, this);
			},

			sync: function (record) {
				this.filters.forEach(function (filter) {
					filter.sync(record);
				});

				this.el.querySelector('.' + this.CSS_CLASSES.TOGGLE).removeAttribute('disabled');
			},

			toggleFilters_: function (event) {
				if (event.target.checked) {
					this.el.querySelector('.mdl-grid').classList.add('is-active');
				}
				else {
					this.resetFilters_();
					this.el.querySelector('.mdl-grid').classList.remove('is-active');
				}
			},

			resetFilters_: function () {
				this.filters.forEach(function (filter) {
					filter.reset();
				});
			},

			selectOption_: function (filter) {
				this.trigger('change-state.filters', filter.getName(), filter.getSelectedOption());
			}
		});

		return FilterCollection;
	}
);