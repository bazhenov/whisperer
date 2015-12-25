/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 23/12/15
 * Time: 18:37
 * To change this template use File | Settings | File Templates.
 */

define(
	['underscore'],
	function (_) {

		/** @constructor */
		function RecordFormatter() {
		}

		_.extend(RecordFormatter.prototype, {

			formatPackageName: function (rawName) {
				rawName = (rawName || "").split('.');

				return _.last(rawName);
			},

			formatFullPackageName: function (rawName) {
				return rawName;
			},

			formatHost: function (rawName) {
				return rawName ? ('@' + rawName) : '';
			},

			formatTime: function (timestamp) {
				var time;

				return _.first((time = new Date(timestamp)).toTimeString().split(' '))
					+ '.' + time.getMilliseconds();
			},

			formatThreadName: function (rawName) {
				return rawName;
			},

			formatMessage: function (rawMessage, args) {
				var fakeEl;

				fakeEl = document.createElement('div');
				fakeEl.innerText = rawMessage;


				(args || []).forEach(function (arg) {
					fakeEl.innerHTML = fakeEl.innerHTML.replace('{}', '<strong class="mdl-color-text--deep-purple-900">' + arg + '</strong>');
				});

				return fakeEl.innerHTML;
			}
		});

		return RecordFormatter;
	}
);