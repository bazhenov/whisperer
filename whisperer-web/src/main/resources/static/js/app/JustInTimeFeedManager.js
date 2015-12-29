/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 29/12/15
 * Time: 00:55
 * To change this template use File | Settings | File Templates.
 */

define(
	['backbone', 'underscore'],
	function (Backbone, _) {

		function JustInTimeFeedManager(scrollingContainer, feedContainer) {
			this.scrollingContainer = scrollingContainer;
			this.feedContainer = feedContainer;

			this.records = null;
			this.filteredRecords = null;
			this.itemPointer = null;
			this.rafRequestedCount = null;
			this.frameRequested = null;

			this.windowHeight = null;
			this.lastScrollTop = 0;

			this.init();
		}

		_.extend(JustInTimeFeedManager.prototype, Backbone.Events, {
			RESERVE_SPACE: 500,
			APPEND_CHUNK: 10,
			AVERAGE_RECORD_HEIGHT: 120,

			init: function () {
				this.clear();
				this.windowHeight = document.body.getBoundingClientRect().height;
				this.scrollingContainer.addEventListener('scroll', this.deBounceScroll_.bind(this));
			},

			appendRecord: function (recordEl) {
				var countToAppend;

				this.records.push(recordEl);
				this.filteredRecords.push(recordEl);

				if (countToAppend = this.getCountForBottomReserve_()) {
					this.requestChange_(countToAppend);
				}
			},

			clear: function () {
				this.records = [];
				this.filteredRecords = [];
				this.itemPointer = -1;
				this.rafRequestedCount = 0;
				this.frameRequested = false;

				this.feedContainer.innerHTML = '';
			},

			filter: function (propertyName, propertyValue) {
				var display, countToAppend;

				// empty feed
				this.rafRequestedCount = -(this.itemPointer + 1);
				this.performDOMManipulation_();
				this.filteredRecords = [];

				this.records.forEach(function (rowEl) {
					display = propertyValue == 'All' || rowEl.getAttribute('data-' + propertyName) == propertyValue;

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

				if (countToAppend = this.getCountForBottomReserve_()) {
					this.requestChange_(countToAppend);
				}
			},

			getCount: function () {
				return this.records.length;
			},

			getFilteredCount: function () {
				return this.filteredRecords.length;
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

			deBounceScroll_: function () {
				var countToAppend, countToRemove;

				if (this.isScrollMovedDown_()) {
					if (countToAppend = this.getCountForBottomReserve_()) {
						this.requestChange_(countToAppend);
					}
				}
				else {
					if (countToRemove = this.getCountForBottomWaste_()) {
						this.requestChange_(-countToRemove);
					}
				}

				this.lastScrollTop = this.scrollingContainer.scrollTop;
			},

			isScrollMovedDown_: function () {
				return this.scrollingContainer.scrollTop > this.lastScrollTop;
			},

			getCountForBottomReserve_: function () {
				var count, actualItemPointer, bottomItemTop;

				count = 0;
				actualItemPointer = this.itemPointer + this.rafRequestedCount;

				// if we are getting close to bottom item => append new ones
				if (actualItemPointer < this.filteredRecords.length - 1) {

					bottomItemTop = this.itemPointer > -1
						? this.filteredRecords[this.itemPointer].getBoundingClientRect().top + this.rafRequestedCount * this.AVERAGE_RECORD_HEIGHT
						: this.feedContainer.getBoundingClientRect().top + this.rafRequestedCount * this.AVERAGE_RECORD_HEIGHT;

					if (0 <= bottomItemTop) {
						if ((bottomItemTop + this.AVERAGE_RECORD_HEIGHT) < (this.windowHeight + this.RESERVE_SPACE)) {
							count = this.APPEND_CHUNK;

							if (actualItemPointer + count >= this.filteredRecords.length) {
								count = this.filteredRecords.length - actualItemPointer - 1;
							}
						}
					}

				}

				return count;
			},

			getCountForBottomWaste_: function () {
				var count, actualItemPointer, bottomItemTop;

				if (this.itemPointer < 0) {
					return 0;
				}

				count = 0;
				actualItemPointer = this.itemPointer + this.rafRequestedCount;

				bottomItemTop = this.filteredRecords[this.itemPointer].getBoundingClientRect().top + this.rafRequestedCount * this.AVERAGE_RECORD_HEIGHT;

				if ((bottomItemTop - this.APPEND_CHUNK * this.AVERAGE_RECORD_HEIGHT) > (this.windowHeight + this.RESERVE_SPACE)) {
					count = this.APPEND_CHUNK;

					if (actualItemPointer + 1 - count < 0) {
						count = actualItemPointer + 1;
					}
				}

				return count;
			},

			requestChange_: function (count) {
				if (!this.frameRequested) {
					requestAnimationFrame(this.performDOMManipulation_.bind(this));
				}

				this.rafRequestedCount += count;
				this.frameRequested = true;
			},

			performDOMManipulation_: function () {
				this.frameRequested = false;

				if (this.rafRequestedCount == 0) {
					return;
				}

				if (this.rafRequestedCount > 0) {
					this.performDOMAppending_(this.rafRequestedCount);
				}
				else {
					this.performDOMRemoving_(-this.rafRequestedCount);
				}

				this.rafRequestedCount = 0;
			},

			performDOMAppending_: function (count) {
				var docFragment;

				docFragment = document.createDocumentFragment();

				while (count--) {
					this.itemPointer++;
					docFragment.appendChild(this.filteredRecords[this.itemPointer]);
				}

				this.feedContainer.appendChild(docFragment);
			},

			performDOMRemoving_: function (count) {
				while (count--) {
					this.filteredRecords[this.itemPointer].parentNode.removeChild(this.filteredRecords[this.itemPointer]);
					this.itemPointer--;
				}
			}
		});

		return JustInTimeFeedManager;
	}
);