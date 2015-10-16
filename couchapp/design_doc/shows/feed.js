function (doc, req) {
	var React = require('lib/react/addons');

	var dot = require('lib/dot');
	dot.templateSettings.strip = false;
	var template = dot.template(this.templates["feed"], null, this.templates);

	var FeedConfig = React.createClass({
		render: function () {
			return React.createElement("div", { className: "configItem" },
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
			);
		}
	});

	start({ 'content-type': 'text/html; charset=utf-8' });
	send(
		template({
			feed: doc,
			body: React.renderToStaticMarkup(
				React.createElement(FeedConfig, { feed: doc })
			)
		})
	);
}
