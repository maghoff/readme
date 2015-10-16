function (doc, req) {
	var React = require('lib/react/addons');
	var FeedConfig = require('lib/component/feed-config');

	var dot = require('lib/dot');
	dot.templateSettings.strip = false;
	var template = dot.template(this.templates["feed"], null, this.templates);

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
