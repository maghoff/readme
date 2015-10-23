function (head, req) {
	var React = require('lib/react');

	var FeedsList = React.createClass({
		render: function () {
			var subscribedFeeds;
			if (this.props.feeds.length) {
				subscribedFeeds = React.createElement("ul", { className: "feeds" },
					this.props.feeds.map(function (feed) {
						return React.createElement("li", null,
							React.createElement("a", { href: "feed/" + feed._id }, feed.title || feed.feed)
						);
					})
				);
			} else {
				subscribedFeeds = React.createElement("p", null, "You are not subscribed to any feeds");
			}

			return React.createElement("div", { className: "content" },
				React.createElement("h1", null, "Subscribed feeds"),
				subscribedFeeds,
				React.createElement("hr", null),
				React.createElement("form", { className: "controlGroupRow", method: "POST" },
					React.createElement("input", { name: "url", placeholder: "http://..." }),
					React.createElement("input", { name: "add", type: "submit", value: "Add subscription" })
				)
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
