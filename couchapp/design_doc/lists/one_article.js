function (head, req) {
	var React = require('lib/react/addons');

	var ArticleView = React.createClass({
		render: function () {
			var iframeProps = {
				className: "contents",
				sandbox: ""
			};
			if (this.props.feed.open_linked) {
				iframeProps.src = this.props.article.link;
			} else {
				iframeProps.seamless = "seamless";
				var description = (this.props.article.description || this.props.article.summary || this.props.article.title);
				iframeProps.srcDoc = description + ("\n" + this.props.tweaks);
				iframeProps.src = "description";
				iframeProps.sandbox = "allow-same-origin";
			}

			return React.createElement("body", null,
				React.createElement("div", { className: "header" },
					React.createElement("h1", null,
						React.createElement("a", { href: "../../../feed/" + this.props.feed._id }, this.props.feed.title)
					),
					React.createElement("h2", null,
						React.createElement("a", { className: "currentPage", href: this.props.article.link }, this.props.article.title)
					)
				),
				React.createElement("iframe", iframeProps)
			);
		}
	});

	var row = getRow();
	if (!row) {
		start({ code: 404, headers: { 'content-type': 'text/plain' } });
		send("Not found");
		return;
	}

	var article = row.value.article;
	var feed = row.doc;

	if (feed.open_linked) {
		start({ code: 302, headers: { location: article.link } });
		send(article.link);
		return;
	}

	start({ headers: { 'content-type': 'text/html; charset=utf-8' } });

	send(this.templates["one_article.mu"]);

	send(
		React.renderToStaticMarkup(
			React.createElement(ArticleView, {
				article: article,
				feed: feed,
				tweaks: this.templates["comic-tweaks"]
			})
		)
	);
}
