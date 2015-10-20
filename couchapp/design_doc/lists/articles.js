function (head, req) {
	var React = require('lib/react');

	var ArticleHeader = React.createClass({
		render: function () {
			var article = this.props.row.value.article;
			var feed = this.props.row.doc;

			return React.createElement("a",
				{
					className: "listItem articleHead" + (article.read ? " read" : ""),
					href: "article/" + (article.seen || article.date) + "/" + article._id + "/",
					"data-open-mode": feed.open_mode || "description"
				},
				React.createElement("div", { className: "articleHeadTitle" },
					React.createElement("span", { className: "feedTitle", }, feed.title),
					React.createElement("span", { className: "articleTitle" }, article.title)
				)
			);
		}
	});

	var ArticleList = React.createClass({
		render: function () {
			var hasPrev = this.props.offset > 0;
			var hasNext = this.props.total_rows > (this.props.offset + this.props.rows.length);

			var prevIsFirst = this.props.offset - this.props.limit <= 0;

			return React.createElement("div", null,
				React.createElement("a",
					{
						className: "listItem" + (hasPrev ? "" : " unavailable"),
						href: prevIsFirst ? "." : "?skip="+(this.props.offset - this.props.limit),
						rel: "prev"
					},
					React.createElement("div", { className: "prev" })
				),
				this.props.rows.map(function (row) {
					return React.createElement(ArticleHeader, { key: row.id, row: row });
				}),
				React.createElement("a",
					{
						className: "listItem" + (hasNext ? "" : " unavailable"),
						href: "?skip="+(this.props.offset + this.props.limit),
						rel: "next"
					},
					React.createElement("div", { className: "next" })
				)
			);
		}
	});


	var limit = parseInt(req.query.limit || "20", 10);

	start({ headers: { 'content-type': 'text/html; charset=utf-8' } });

	var rows = [];
	var row;
	while (row = getRow()) rows.push(row);

	send(require('templates/overview')({
		list: React.renderToStaticMarkup(
			React.createElement(ArticleList, {
				rows: rows,
				total_rows: head.total_rows,
				offset: head.offset,
				limit: limit
			})
		)
	}));
}
