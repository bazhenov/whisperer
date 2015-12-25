/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 22/12/15
 * Time: 15:25
 * To change this template use File | Settings | File Templates.
 */

define(
	['module', 'underscore', 'backbone'],
	function (module, _, Backbone) {
		function EventSourceNull() {}

		_.extend(EventSourceNull.prototype, {
			addEventListener: function (eventName, callback) {
			},
			close: function () {
			}
		});

		/**
		 *
		 * @constructor
		 */
		function FeedReceiver() {
			this.endPoint = module.config().FEED_URL;
			this.eventSource = new EventSourceNull;
		}

		_.extend(FeedReceiver.prototype, Backbone.Events, {
			start: function (criteria) {
				this.eventSource = new EventSource(this.populateEndPointUrl_(criteria));
				this.eventSource.addEventListener('log', _.bind(this.onLogReceived_, this));
			},

			stop: function () {
				this.eventSource.close();
			},

			onLogReceived_: function (event) {
				var recordCollection = JSON.parse(event.data);

				this.trigger('log-received', recordCollection);
			},

			populateEndPointUrl_: function (criteria) {
				var args = [], key;

				for (key in criteria) if (criteria.hasOwnProperty(key)) {
					args.push(key + '=' + encodeURIComponent(criteria[key]));
				}

				return this.endPoint + '?' + args.join('&');
			}
		});

		return FeedReceiver;
	}
);