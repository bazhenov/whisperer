/**
 * Created with JetBrains PhpStorm.
 * User: antonhola
 * Date: 22/12/15
 * Time: 14:59
 * To change this template use File | Settings | File Templates.
 */

requirejs.config({
	amd: false,
	paths: {
		'underscore': '/bower_components/underscore/underscore-min',
		'jquery': '/bower_components/jquery/dist/jquery.min',
		'backbone': '/bower_components/backbone/backbone-min',
		'App': '/js/app/App',
		'FeedReceiver': '/js/app/FeedReceiver',
		'TraceCriteriaForm': '/js/app/TraceCriteriaForm',
		'RecordFormatter': '/js/app/RecordFormatter',
		'FilterCollection': '/js/app/FilterCollection',
		'RecordMessageClickBehavior': '/js/app/RecordMessageClickBehavior',
		'JustInTimeFeedManager': '/js/app/JustInTimeFeedManager'
	},
	config: {
		'FeedReceiver': {
			FEED_URL: '/stream.php'
		}
	}
});

requirejs(
	['App'],
	function (App) {
		var app = new App;

		app.run();
	}
);