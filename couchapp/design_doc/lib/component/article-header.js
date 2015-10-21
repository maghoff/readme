var React = require('lib/react');

var ArticleHeader = React.createClass({
	render: function () {
		var article = this.props.row.value.article;
		var feed = this.props.row.doc;

		var post = this.props.root + "article/" + (article.seen || article.date) + "/" + article._id + "/";

		if (feed.open_mode === "open_linked") href = article.link;
		else href = post;

		return React.createElement("a",
			{
				className: "listItem articleHead" + (article.read ? " read" : ""),
				href: href,
				"data-post": (feed.open_mode === "open_linked") ? post : undefined,
				"data-open-mode": feed.open_mode || "description"
			},
			React.createElement("div", { className: "articleHeadTitle" },
				React.createElement("span", { className: "feedTitle", }, feed.title),
				React.createElement("span", { className: "articleTitle" }, article.title)
			)
		);
	}
});

module.exports = ArticleHeader;
