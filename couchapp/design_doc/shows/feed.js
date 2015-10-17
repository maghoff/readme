function (doc, req) {
	var React = require('lib/react');
	var FeedConfig = require('lib/component/feed-config');
	var template = require('templates/feed');

	delete doc._revisions;

	start({ 'content-type': 'text/html; charset=utf-8' });
	send(
		template({
			feed: doc,
			feed_config: React.renderToString(
				React.createElement(FeedConfig, { feed: doc })
			)
		})
	);
}
