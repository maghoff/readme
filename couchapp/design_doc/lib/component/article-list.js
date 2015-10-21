var React = require('lib/react');
var ArticleHeader = require('./article-header');

var ArticleList = React.createClass({
	render: function () {
		var hasPrev = this.props.offset > 0;
		var hasNext = this.props.total_rows > (this.props.offset + this.props.rows.length);

		var prevIsFirst = this.props.offset - this.props.limit <= 0;

		return React.createElement("div", null,
			this.props.navigation && React.createElement("a",
				{
					className: "listItem" + (hasPrev ? "" : " unavailable"),
					href: prevIsFirst ? "." : "?skip="+(this.props.offset - this.props.limit),
					rel: "prev"
				},
				React.createElement("div", { className: "prev" })
			),
			this.props.rows.map(function (row) {
				return React.createElement(ArticleHeader, { key: row.id, row: row, root: this.props.root });
			}.bind(this)),
			this.props.navigation && React.createElement("a",
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

module.exports = ArticleList;
