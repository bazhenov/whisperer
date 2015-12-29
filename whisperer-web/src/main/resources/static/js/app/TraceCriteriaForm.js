/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 22/12/15
 * Time: 15:47
 * To change this template use File | Settings | File Templates.
 */

define(
	['underscore', 'backbone'],
	function (_, Backbone) {

		/** @constructor */
		function TraceCriteriaForm() {
			this.el = document.querySelector('.' + this.CSS_CLASSES.FORM);
			this.listenActionEl = this.el.querySelector('.' + this.CSS_CLASSES.LISTEN_ACTION);
			this.stopActionEl = this.el.querySelector('.' + this.CSS_CLASSES.STOP_ACTION);
			this.state = this.STATES.IDLE;

			this.init();
		}

		_.extend(TraceCriteriaForm.prototype, Backbone.Events, {
			STATES: {
				IDLE: 'idle',
				BUSY: 'busy'
			},

			FIELD_NAMES: ['keyName', 'expectedValue', 'severity', 'prefix'],

			REQUIRED_FIELD_NAMES: ['keyName', 'expectedValue'],

			STORAGE_KEY_PREFIX: 'whisperer.form.',

			CSS_CLASSES: {
				FORM: 'whisperer__form',
				STATE_BUSY: 'whisperer__form--state-busy',
				FIELD: 'whisperer__form__field',
				LISTEN_ACTION: 'whisperer__form__listen-action',
				STOP_ACTION: 'whisperer__form__stop-action',
				IS_DIRTY: 'is-dirty',
				RADIO_GROUP: 'whisperer__form__radio-group',
				BUTTON: 'mdl-button',
				RADIO_BUTTON_SELECTED: 'mdl-button--accent',
				RADIO_BUTTON_RAISED: 'mdl-button--raised'
			},

			init: function () {
				this.field = {};

				this.FIELD_NAMES.forEach(function (fieldName) {
					this.field[fieldName] = this.el.querySelector('.' + this.CSS_CLASSES.FIELD + '[name=' + fieldName + ']');
				}, this);

				this.listenActionEl.addEventListener('click', this.setBusyState_.bind(this));
				this.stopActionEl.addEventListener('mousedown', this.setIdleState_.bind(this));

				this.el.addEventListener('click', this.radioGroupChange_.bind(this));

				this.tryFillFormWithPersistentValues_();
			},

			radioGroupChange_: function (event) {
				var button, selected;

				button = event.target.parentNode;

				if (!button.classList.contains(this.CSS_CLASSES.BUTTON) || !button.getAttribute('data-value')) {
					return;
				}

				selected = this.el.querySelector('.' + this.CSS_CLASSES.RADIO_GROUP + ' .' + this.CSS_CLASSES.RADIO_BUTTON_SELECTED);

				if (selected.getAttribute('data-value') != button.getAttribute('data-value')) {
					selected.classList.remove(this.CSS_CLASSES.RADIO_BUTTON_SELECTED);
					selected.classList.remove(this.CSS_CLASSES.RADIO_BUTTON_RAISED);
					button.classList.add(this.CSS_CLASSES.RADIO_BUTTON_SELECTED);
					button.classList.add(this.CSS_CLASSES.RADIO_BUTTON_RAISED);
					this.field['severity'].value = button.getAttribute('data-value');
				}
			},

			setBusyState_: function () {
				if (!this.validate_()) {
					return;
				}
				this.el.classList.add(this.CSS_CLASSES.STATE_BUSY);
				this.setFieldEnabled_(false);
				this.listenActionEl.setAttribute('disabled', '');
				this.trigger('start-listen', this.createCriteria_());
				this.persistForm_();
				this.state = this.STATES.BUSY;
			},

			setIdleState_: function () {
				this.el.classList.remove(this.CSS_CLASSES.STATE_BUSY);
				this.setFieldEnabled_(true);
				this.listenActionEl.removeAttribute('disabled');
				this.trigger('stop-listen');
				this.state = this.STATES.IDLE;
			},

			tryFillFormWithPersistentValues_: function () {
				this.FIELD_NAMES.forEach(function (fieldName) {
					if (!localStorage.getItem(this.STORAGE_KEY_PREFIX + fieldName)) {
						return;
					}

					this.field[fieldName].parentNode.classList.add(this.CSS_CLASSES.IS_DIRTY);

					setTimeout((function () {
						this.field[fieldName].value = localStorage.getItem(this.STORAGE_KEY_PREFIX + fieldName);
					}).bind(this), 300);
				}, this);
			},

			persistForm_: function () {
				this.FIELD_NAMES.forEach(function (fieldName) {
					localStorage.setItem(this.STORAGE_KEY_PREFIX + fieldName, this.field[fieldName].value);
				}, this);
			},

			validate_: function () {
				var valid = true;

				this.REQUIRED_FIELD_NAMES.forEach(function (fieldName) {
					if (this.field[fieldName].value.length < 2) {
						this.field[fieldName].parentNode.classList.add('is-invalid');
						valid = false;
					}
					else {
						this.field[fieldName].parentNode.classList.remove('is-invalid');
					}
				}, this);

				return valid;
			},

			setFieldEnabled_: function (enabled) {
				this.FIELD_NAMES.forEach(function (fieldName) {
					if (enabled) {
						this.field[fieldName].removeAttribute('disabled');
					}
					else {
						this.field[fieldName].setAttribute('disabled', 'disabled');
					}
				}, this);
			},

			createCriteria_: function () {
				return {
					k: this.field['keyName'].value,
					v: this.field['expectedValue'].value,
					level: this.field['severity'].value,
					prefix: this.field['prefix'].value
				};
			}
		});

		return TraceCriteriaForm;
	}
);