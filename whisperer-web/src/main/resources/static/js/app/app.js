/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 22/12/15
 * Time: 15:01
 * To change this template use File | Settings | File Templates.
 */

define(
	['underscore', 'backbone', 'FeedReceiver', 'FeedView', 'TraceCriteriaForm'],
	function (_, Backbone, FeedReceiver, FeedView, TraceCriteriaForm) {
		/**
		 *
		 * @constructor
		 */
		function App() {
			this.form = new TraceCriteriaForm();
			this.feedReceiver = new FeedReceiver();
			this.feedView = new FeedView();
		}

		_.extend(App.prototype, Backbone.Events, {
			run: function () {
				this.listenTo(this.feedReceiver, 'log-received', this.appendFeedRecord_);
				this.listenTo(this.form, 'start-listen', this.startReceiver_);
				this.listenTo(this.form, 'stop-listen', this.stopReceiver_);
			},

			appendFeedRecord_: function (record) {
				this.feedView.appendRecord(record);
				componentHandler.upgradeAllRegistered();
			},

			startReceiver_: function (criteria) {
				this.feedReceiver.start(criteria);
			},

			stopReceiver_: function () {
				this.feedReceiver.stop();
			}
		});

		return App;
	}
);