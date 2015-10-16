function (doc, req) {
	var React = require('react/addons');

	var dot = require('dot');
	var template = dot.template(this.templates["feed"]);

	var FeedConfig = React.createClass({
		render: function () {
			return React.createElement("div", { className: "config" },
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
			);
		}
	});

	start({
		'content-type': 'text/html; charset=utf-8'
	});
	send(
		template({
			ddoc: this,
			feed: doc,
			body: React.renderToStaticMarkup(
				React.createElement(FeedConfig, { feed: doc })
			)
		})
	);
}
