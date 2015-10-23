function (head, req) {
	var React = require('lib/react');

	var FeedsList = React.createClass({
		render: function () {
			return React.createElement("ul", { className: "feeds" },
				this.props.feeds.map(function (feed) {
					return React.createElement("li", null,
						React.createElement("a", { href: "feed/" + feed._id }, feed.title)
					);
				})
			);
		}
	});

	var feeds = [];
	var row;
	while (row = getRow()) feeds.push(row.value);

	start({ headers: { 'content-type': 'text/html; charset=utf-8' } });
	send(require('templates/feeds')({
		feeds: React.renderToStaticMarkup(
			React.createElement(FeedsList, { feeds: feeds })
		)
	}));
}
