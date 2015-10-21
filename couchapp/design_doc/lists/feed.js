function (head, req) {
	var React = require('lib/react');
	var FeedConfig = require('lib/component/feed-config');
	var ArticleList = require('lib/component/article-list');
	var template = require('templates/feed');

	var doc = getRow().doc;
	var articles = [];
	var row;
	while (row = getRow()) {
		row.value = { article: row.doc };
		row.doc = doc;
		articles.push(row);
	}

	delete doc._revisions;

	start({ headers: { 'content-type': 'text/html; charset=utf-8' }});
	send(
		template({
			feed: doc,
			feed_config: React.renderToString(
				React.createElement(FeedConfig, { feed: doc })
			),
			articles: React.renderToString(
				React.createElement(ArticleList, {
					root: "../",
					navigation: false,
					rows: articles,
					total_rows: head.total_rows,
					offset: head.offset,
					limit: 20
				})
			)
		})
	);
}
