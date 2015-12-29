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

		function RecordMessageClickBehavior(feedEl, messageClassName) {
			this.feedEl = feedEl;
			this.messageClassName = messageClassName;
			this.focusedMessageEl = document.createElement('div'); //NullObject

			this.init();
		}

		_.extend(RecordMessageClickBehavior.prototype, {
			KEYS: {
				ESC: 27
			},

			CSS_CLASSES: {
				PRE_EXPANDED: 'pre-expanded',
				EXPANDED: 'expanded'
			},

			init: function () {
				this.feedEl.addEventListener('click', this.clickOnMessageEl_.bind(this), true);
				document.addEventListener('click', this.clickOnWhatEver_.bind(this), true);
				document.addEventListener('keyup', this.keyUpOnDocument_.bind(this));
			},

			clickOnMessageEl_: function (event) {
				// Don't capture events, that doesn't target to message element
				if (!event.target.classList.contains(this.messageClassName)) {
					return;
				}

				if (!event.target.classList.contains(this.CSS_CLASSES.EXPANDED)) {
					this.expandMessageContent_(event.target);
				}
				else {
					this.collapseMessageContent_(event.target);
				}

				event.stopPropagation();
			},

			keyUpOnDocument_: function (event) {
				if (event.which == this.KEYS.ESC) {
					this.collapseMessageContent_(this.focusedMessageEl);
				}
			},

			clickOnWhatEver_: function (event) {
				if (event.target.classList.contains(this.messageClassName)) {
					return;
				}

				this.collapseMessageContent_(this.focusedMessageEl);
			},

			expandMessageContent_: function (messageEl) {
				this.collapseMessageContent_(this.focusedMessageEl);

				messageEl.classList.add(this.CSS_CLASSES.PRE_EXPANDED);
				messageEl.offsetTop = 2 * messageEl.offsetTop / 2; // force reflow
				messageEl.classList.add(this.CSS_CLASSES.EXPANDED);

				this.focusedMessageEl = messageEl;
			},

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