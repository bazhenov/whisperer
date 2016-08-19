/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 19/08/16
 * Time: 15:55
 * To change this template use File | Settings | File Templates.
 */

define(
	['backbone', 'underscore'],
	function (Backbone, _) {

		function StraightForwardFeedManager(feedContainer) {
			this.feedContainer = feedContainer;

			this.records = null;
			this.filteredRecords = null;

			this.init();
		}

		_.extend(StraightForwardFeedManager.prototype, Backbone.Events, {
			init: function () {
				this.clear();
			},

			appendRecord: function (recordEl) {
				this.records.push(recordEl);
				this.filteredRecords.push(recordEl);

				this.feedContainer.appendChild(this.filteredRecords[this.filteredRecords.length - 1]);
			},

			clear: function () {
				this.records = [];
				this.filteredRecords = [];
				this.feedContainer.innerHTML = '';
			},

			filter: function (propertyName, propertyValue) {
				var display;

				this.filteredRecords = [];

				this.records.forEach(function (rowEl) {
					display = propertyValue == 'All' || rowEl.getAttribute('data-' + propertyName) == propertyValue;
1
					if (display) {
						rowEl.classList.remove(propertyName + '-hide');

						if (!this.isRowFilteredOut_(rowEl)) {
							this.filteredRecords.push(rowEl);
						}
					}
					else {
						rowEl.classList.add(propertyName + '-hide');
					}
				}, this);
			},

			// hard coded filter css classes
			isRowFilteredOut_: function (rowEl) {
				var filterOutClasses = ['packageName-hide', 'threadName-hide', 'host-hide'],
					res = false;

				filterOutClasses.forEach(function (className) {
					res |= rowEl.classList.contains(className);
				});

				return res;
			},

			getCount: function () {
				return this.records.length;
			},

			getFilteredCount: function () {
				return this.filteredRecords.length;
			}
		});

		return StraightForwardFeedManager;
	}
);