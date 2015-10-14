#!/usr/bin/env node

var FeedParser = require('feedparser');
var request = require('request');
var uuid = require('node-uuid');
var crypto = require('crypto');

var feeds = require('fs').readFileSync('../feeds.txt', 'utf8').trim().split('\n');

var userAgent = [
	'readme/' + require('./package.json').version,
	'request/' + require('request/package.json').version,
	'nodejs/' + process.version
].join(' ');

function readFeed(url, monitor) {
	var id = uuid.v4();

	var req = request({
		url: url,
		gzip: true,
		headers: { 'user-agent': userAgent }
	});

	req.on('error', function (error) {
		monitor.error({
			error: 'request',
			stack: error.stack
		});
	});

	req.on('response', function (res) {
		var stream = this;

		if (res.statusCode != 200) {
			monitor.error({
				error: 'request',
				stack: (new Error('Bad status code: ' + res.statusCode)).stack
			});
			return;
		}

		var feedparser = new FeedParser({ feedurl: url });
		stream.pipe(feedparser);

		feedparser.on('meta', function (meta) {
			// feedparser.meta has been parsed
			monitor.feed({
				id: id,
				title: meta.title,
				feed: url,
				cannonical_feed: meta.xmlurl,
				description: meta.description,
				link: meta.link,
				date: meta.date || new Date(),
				image: meta.image
			});
		});

		feedparser.on('error', function (error) {
			monitor.error({
				error: 'feedparser',
				stack: error.stack
			});
		});

		feedparser.on('readable', function () {
			var item;
			while (item = feedparser.read()) {
				monitor.item({
					feed: id,
					guid: item.guid,
					date: item.date || item.pubdate || feedparser.meta.date || new Date(),
					title: item.title,
					link: item.link,
					summary: item.summary,
					description: item.description,
					image: item.image
				});
			}
		});

		feedparser.on('end', function () {
			monitor.end();
		});
	});
}

function hash(str) {
	var hasher = crypto.createHash('sha1');
	hasher.write(str);
	return hasher.digest('hex');
}

var items = [];
var outstanding = 0;
feeds.forEach(function (url) {
	outstanding++;
	readFeed(url, {
		error: function (err) {
			console.error("Failed to log error for " + url);
			outstanding--;
		},
		feed: function (feed) {
			items.push({
				_id: feed.id,
				type: "feed",
				title: feed.title,
				description: feed.description,
				link: feed.link,
				feed: feed.feed,
				date: feed.date.toISOString(),
				image: feed.image
			});
		},
		item: function (item) {
			var date = (new Date()).toISOString();
			try { date = item.date.toISOString(); } catch (err) {}
			items.push({
				_id: hash(item.guid),
				type: "article",
				feed: item.feed,
				guid: item.guid,
				date: date,
				title: item.title,
				link: item.link,
				description: item.description,
				read: true
			});
		},
		end: function () {
			outstanding--;
			if (outstanding === 0) done(items);
		}
	});
});

function done(items) {
	var req = request.post({
		uri: "http://localhost:5986/readme/_bulk_docs",
		json: true,
		body: {
			"docs": items
		},
		headers: {
			"content-type": "application/json"
		}
	});
	req.on('response', function (res) {
		req.pipe(process.stdout);
	});
}
