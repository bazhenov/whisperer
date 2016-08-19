/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 22/12/15
 * Time: 17:11
 * To change this template use File | Settings | File Templates.
 */

define(
	['underscore', 'backbone','FilterCollection', 'RecordFormatter', 'RecordMessageClickBehavior', 'JustInTimeFeedManager', 'StraightForwardFeedManager'],

	function (_, Backbone, FilterCollection, RecordFormatter, RecordMessageClickBehavior, JustInTimeFeedManager, StraightForwardFeedManager) {

		var Templates = {
			Record: _.template(
				'<td class="mdl-data-table__cell--non-numeric whisperer__feed__record__package">' +
					'<div><strong class="mdl-color-text--blue-grey-800"><%= vars.host %></strong></div>' +
					'<div class="mdl-typography--body-1-force-preferred-font mdl-color-text--pink-A400 whisperer__feed__record__package-name" id="<%= vars.recordPackageId %>">' +
						'<strong><%= vars.packageName %></strong>' +
					'</div>' +
					'<div class="mdl-tooltip" for="<%= vars.recordPackageId %>"><%= vars.fullPackageName %></div>' +
					'<div>' +
						'<span class="mdl-color-text--grey-500">Thread: </span>' +
						'<span class="mdl-color-text--black-600"><%= vars.threadName %></span>' +
					'</div>' +
					'<time class="mdl-color-text--grey-600"><%= vars.time %></time>' +
				'</td>' +
				'<td class="mdl-data-table__cell--non-numeric">' +
					'<div class="whisperer__feed__record__message mdl-shadow--2dp"><%= vars.message %></div>' +
				'</td>'
				, null, {variable: 'vars'}
			)
		};

		function FeedView() {
			this.el = document.querySelector('.' + this.CSS_CLASSES.FEED);
			this.recordFormatter = new RecordFormatter;
			this.recordMessageClickBehavior = new RecordMessageClickBehavior(this.el, this.CSS_CLASSES.MESSAGE);
			this.filterCollection = new FilterCollection(this.META_FOR_FILTERS);
			this.feedManager = new StraightForwardFeedManager(this.el.querySelector('tbody'));

			this.init();
		}

		_.extend(FeedView.prototype, Backbone.Events, {
			META_FOR_FILTERS: [
				{
					name: 'packageName',
					title: 'Package Name'
				},
				{
					name: 'host',
					title: 'Host Name'
				},
				{
					name: 'threadName',
					title: 'Thread Name'
				}
			],

			CSS_CLASSES: {
				FEED: 'whisperer__feed__container',
				RECORD: 'whisperer__feed__record',
				MESSAGE: 'whisperer__feed__record__message',
				STATE_IS_ACTIVE: 'whisperer__feed__container--is-active',
				CLEAR: 'whisperer__feed__clear',
				TOTAL: 'whisperer__feed__total'
			},

			init: function () {
				this.filterCollection.render();
				this.listenTo(this.filterCollection, 'change-state.filters', this.syncFeedWithFilters_);
				this.el.querySelector('.' + this.CSS_CLASSES.CLEAR).addEventListener('click', this.clear_.bind(this));
			},

			appendRecord: function (record) {
				var tr, formattedRecord;

				formattedRecord = this.formatRecord_(record);
				tr = this.createRecord_(formattedRecord);

				this.el.classList.add(this.CSS_CLASSES.STATE_IS_ACTIVE);
				this.filterCollection.show();

				this.feedManager.appendRecord(tr);
				this.filterCollection.sync(formattedRecord);

				this.updateTotal_();
			},

			createRecord_: function (formattedRecord) {
				var tr;

				tr = document.createElement('tr');
				tr.classList.add(this.CSS_CLASSES.RECORD);
				tr.innerHTML = Templates.Record(formattedRecord);

				tr.setAttribute('data-host', formattedRecord.host);
				tr.setAttribute('data-threadname', formattedRecord.threadName);
				tr.setAttribute('data-packagename', formattedRecord.packageName);

				return tr;
			},

			syncFeedWithFilters_: function (propertyName, propertyValue) {
				document.querySelector('.whisperer__feed__filter-sync-progress').style.display = 'block';
				this.feedManager.filter(propertyName, propertyValue);
				this.updateTotal_();

				setTimeout(function () {
					document.querySelector('.whisperer__feed__filter-sync-progress').style.display = '';
				}, 200);
			},

			formatRecord_: function (rawRecord) {
				var record = {};

				record.packageName = this.recordFormatter.formatPackageName(rawRecord.group);
				record.fullPackageName = this.recordFormatter.formatFullPackageName(rawRecord.group);
				record.host = this.recordFormatter.formatHost(rawRecord.host);
				record.recordPackageId = _.uniqueId('record-package-');
				record.time = this.recordFormatter.formatTime(rawRecord.timestamp);
				record.threadName = this.recordFormatter.formatThreadName(rawRecord.thread);
				record.message = this.recordFormatter.formatMessage(rawRecord.message, rawRecord.args);

				return record;
			},

			clear_: function () {
				this.el.classList.remove(this.CSS_CLASSES.STATE_IS_ACTIVE);
				this.filterCollection.hide();
				this.removeRecords_();
				this.updateTotal_();
				this.filterCollection.clearOptions();
			},

			removeRecords_: function () {
				this.feedManager.clear();
			},

			updateTotal_: function () {
				var caption;

				if (this.feedManager.getCount() == 0) {
					caption = 'No';
				}
				else {
					caption = this.feedManager.getCount();

					if (this.feedManager.getFilteredCount() != this.feedManager.getCount()) {
						caption += ' (' + this.feedManager.getFilteredCount() + ')';
					}
				}

				this.el.querySelector('.' + this.CSS_CLASSES.TOTAL).innerHTML = caption;
			}
		});

		return FeedView;
	}
);