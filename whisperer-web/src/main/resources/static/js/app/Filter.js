/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 22/12/15
 * Time: 17:12
 * To change this template use File | Settings | File Templates.
 */

define(
	['underscore', 'backbone'],
	function (_, Backbone) {

		var Templates = {
			Filter: _.template(
				'<div class="whisperer__feed__filter mdl-cell" data-name="<%= vars.name %>">' +
					'<h5><%= vars.title %></h5>' +

					'<div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable whisperer__feed__filter__search">' +
						'<label class="mdl-button mdl-js-button mdl-button--icon" for="filter_search_<%= vars.name %>">' +
							'<i class="material-icons">search</i>' +
						'</label>' +
						'<div class="mdl-textfield__expandable-holder">' +
							'<input class="mdl-textfield__input whisperer__feed__filter__search-input" type="text" id="filter_search_<%= vars.name %>">' +
							'<label class="mdl-textfield__label" for="sample-expandable">Expandable Input</label>' +
						'</div>' +
					'</div>' +

					'<ul></ul>' +
					'<div class="whisperer__feed__filter__bag"></div>' +
				'</div>'
				, null, {variable: 'vars'}),

			Option: _.template(
				'<li class="whisperer__feed__filter__option">' +
					'<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect">' +
						'<input class="mdl-radio__button" name="<%= vars.name %>" type="radio" value="<%= vars.title %>">' +
						'<span class="mdl-radio__label mdl-typography--body-2-force-preferred-font mdl-color-text--indigo-900"><%= vars.title %></span>' +
					'</label>' +
				'</li>'
				, null, {variable: 'vars'}),

			Bag: _.template(
				'<div class="whisperer__feed__filter__bag__item"><%= vars.value %>' +
					'<i class="close material-icons mdl-color-text--grey-300">cancel</i>' +
				'</div>'
			, null, {variable: 'vars'})

		};

		function Filter(name, title) {
			this.name = name;
			this.title = title;
			this.el = document.createElement('div');
			this.options = [];

			this.init();
		}

		_.extend(Filter.prototype, Backbone.Events, {
			KEYS: {
				ENTER: 13,
				ESC: 27
			},
			CSS_CLASSES: {
				OPTION: 'whisperer__feed__filter__option',
				OPTION_SELECTED: 'whisperer__feed__filter__option--selected',
				SEARCH: 'whisperer__feed__filter__search',
				SEARCH_INPUT: 'whisperer__feed__filter__search-input',
				BAG: 'whisperer__feed__filter__bag',
				BAG_CANCEL: 'close'
			},

			init: function () {
				this.render_();
				this.el.addEventListener('change', this.selectOption_.bind(this));
				this.el.addEventListener('keyup', this.onSearchChange_.bind(this));
				this.el.addEventListener('click', this.cancelSelected_.bind(this));
				this.el.addEventListener('click', this.searchBarClick_.bind(this));
			},

			render_: function () {
				this.el.innerHTML = Templates.Filter({title: this.title, name: this.name});
				this.el = this.el.firstChild;

				this.clearOptions();
			},

			sync: function (record) {
				if (!record[this.name]) {
					return;
				}

				if (this.options.indexOf(record[this.name]) == -1) {
					this.appendOption_(record[this.name]);
				}

				this.increaseCountForOption_(record[this.name]);
			},

			getName: function () {
				return this.name;
			},

			getSelectedOption: function () {
				return this.el.querySelector('.is-checked input').value;
			},

			getView: function () {
				return this.el;
			},

			reset: function () {
				this.el.querySelector('.mdl-radio').click();
				this.el.querySelector('.' + this.CSS_CLASSES.SEARCH_INPUT).value = '';
				this.filterOptions_(this.el.querySelector('.' + this.CSS_CLASSES.SEARCH_INPUT).value);
			},

			clearOptions: function () {
				this.el.querySelector('ul').innerHTML = '';
				this.options = [];
				this.appendOption_('All');
				this.el.querySelector('.mdl-radio').classList.add('is-checked');
				this.el.querySelector('.mdl-radio').click();
			},

			selectOption_: function (event) {
				if (event.target.name != this.name) {
					return;
				}

				this.putSelectedIntoTheBag_();

				this.trigger('select-option.filter', this);
			},

			putSelectedIntoTheBag_: function () {
				var bagItem;

				bagItem = this.getSelectedOption() != 'All'
					? Templates.Bag({value: this.getSelectedOption()})
					: '';

				this.el.querySelector('.' + this.CSS_CLASSES.BAG).innerHTML = bagItem;
			},

			cancelSelected_: function (event) {
				if (!event.target.classList.contains(this.CSS_CLASSES.BAG_CANCEL)) {
					return;
				}

				this.reset();
				this.putSelectedIntoTheBag_();
			},

			onSearchChange_: function (event) {
				if (!event.target.classList.contains(this.CSS_CLASSES.SEARCH_INPUT)) {
					return;
				}

				if (event.which != this.KEYS.ESC) {
					this.filterOptions_(event.target.value);
				}
				else {
					event.target.value = '';
					this.filterOptions_(event.target.value);
					event.target.blur();
				}
			},

			searchBarClick_: function (event) {
				if (!event.target.classList.contains(this.CSS_CLASSES.SEARCH)) {
					return;
				}

				this.el.querySelector('.' + this.CSS_CLASSES.SEARCH_INPUT).focus();
			},

			filterOptions_: function (value) {
				var itemValue, display;

				value = value.toLowerCase();

				this.getOptions_().forEach(function (item) {
					if (value.length < 2) {
						item.style.display = '';
					}
					else {
						itemValue = item.querySelector('input').value.toLowerCase();

						if (itemValue == 'all') {
							return;
						}

						display = itemValue.indexOf(value) > -1 ? '' : 'none';
						item.style.display = display;
					}
				}, this);
			},

			appendOption_: function (optionName) {
				var item;

				(item = document.createElement('div')).innerHTML = Templates.Option({name: this.name, title: optionName});
				item = item.firstChild;

				this.el.querySelector('ul').appendChild(item);
				this.options.push(optionName);
			},

			increaseCountForOption_: function (optionName) {
				this.getOptions_().forEach(function (item) {
					if (item.querySelector('input').value == optionName) {
						item.setAttribute('data-count', (+item.getAttribute('data-count')||0) + 1);
					}
				});
			},

			getOptions_: function () {
				return Array.prototype.slice.apply(this.el.querySelectorAll('.' + this.CSS_CLASSES.OPTION));
			}
		});

		return Filter;
	}
);