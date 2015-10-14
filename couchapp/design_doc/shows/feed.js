function (doc, req) {
	var React = require('react/addons');

	var FeedConfig = React.createClass({
		render: function () {
			return React.createElement("body", null,
				React.createElement("div", { className: "header" },
					React.createElement("span", { className: "feedTitle" }, this.props.feed.title),
					React.createElement("span", { className: "articleTitle" }, "Configuration")
				),
				React.createElement("div", { className: "config" },
					React.createElement("div", { className: "configItem" },
						React.createElement("p", { className: "configDescription" },
							"When displaying articles from this feed..."),
						React.createElement("div", { className: "buttonList" },
							React.createElement("div",
								{ className: "button" + (this.props.feed.open_linked ? "" : " selected") },
								"Show description from feed"),
							React.createElement("div",
								{ className: "button" + (this.props.feed.open_linked ? " selected" : "") },
								"Embed linked article")
						)
					)
				)
			);
		}
	});

	start({
		'content-type': 'text/html; charset=utf-8'
	});
	send(this.templates["feed.mu"]);
	send(React.renderToStaticMarkup(
		React.createElement(FeedConfig, { feed: doc })
	));
}
