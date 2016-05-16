/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 24/12/15
 * Time: 12:22
 * To change this template use File | Settings | File Templates.
 */

define(
	['underscore'],
	function (_) {

		/**
		 * @param {HTMLElement} feedEl
		 * @param {string} messageClassName
         * @constructor
         */
		function RecordMessageClickBehavior(feedEl, messageClassName) {
			this.feedEl = feedEl;
			this.messageClassName = messageClassName;
			this.focusedMessageEl = document.createElement('div'); //NullObject

			this.init();
		}


		_.extend(RecordMessageClickBehavior.prototype, /** @lends RecordMessageClickBehavior.prototype */ {
			KEYS: {
				ESC: 27
			},

			CSS_CLASSES: {
				PRE_EXPANDED: 'pre-expanded',
				EXPANDED: 'expanded'
			},

			/**
			 * @constructs
			 */
			init: function () {
				this.feedEl.addEventListener('click', this.clickOnMessageEl_.bind(this), true);
				document.addEventListener('click', this.clickOnWhatEver_.bind(this), true);
				document.addEventListener('keyup', this.keyUpOnDocument_.bind(this));
			},

			/**
			 * @private
			 */
			clickOnMessageEl_: function (event) {
				var messageEl;

				// Don't capture events, that doesn't target to message element or to it's children
				if (null == (messageEl = this.getMessageElWhichContainsTarget_(event.target))) {
					return;
				}

				if (!messageEl.classList.contains(this.CSS_CLASSES.EXPANDED)) {
					this.expandMessageContent_(messageEl);
				}
				else {
					this.collapseMessageContent_(messageEl);
				}

				event.stopPropagation();
			},

			/**
			 * @private
             */
			getMessageElWhichContainsTarget_: function (target) {
				while (target != document) {
					if (target.classList.contains(this.messageClassName)) {
						return target;
					}

					target = target.parentNode;
				}

				return null;
			},

			/**
			 * @private
			 */
			keyUpOnDocument_: function (event) {
				if (event.which == this.KEYS.ESC) {
					this.collapseMessageContent_(this.focusedMessageEl);
				}
			},

			/**
			 * @private
			 */
			clickOnWhatEver_: function (event) {
				if (this.getMessageElWhichContainsTarget_(event.target)) {
					return;
				}

				this.collapseMessageContent_(this.focusedMessageEl);
			},

			/**
			 * @private
			 */
			expandMessageContent_: function (messageEl) {
				this.collapseMessageContent_(this.focusedMessageEl);

				messageEl.classList.add(this.CSS_CLASSES.PRE_EXPANDED);
				messageEl.getBoundingClientRect();
				messageEl.classList.add(this.CSS_CLASSES.EXPANDED);

				this.focusedMessageEl = messageEl;
			},

			/**
			 * @private
			 */
			collapseMessageContent_: function (messageEl) {
				if (!messageEl.classList.contains(this.CSS_CLASSES.EXPANDED)) {
					return;
				}

				messageEl.classList.remove(this.CSS_CLASSES.EXPANDED);

				setTimeout((function () {
					messageEl.classList.remove(this.CSS_CLASSES.PRE_EXPANDED);
				}).bind(this), 200);

				this.focusedMessageEl = document.createElement('div');
			}
		});

		return RecordMessageClickBehavior;
	}
);