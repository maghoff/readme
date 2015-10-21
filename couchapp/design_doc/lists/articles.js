function (head, req) {
	var React = require('lib/react');
	var ArticleList = require('lib/component/article-list');

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
