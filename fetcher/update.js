#!/usr/bin/env node

var url = require('url');
var async = require('async');
var FeedParser = require('feedparser');
var request = require('request');
var crypto = require('crypto');
var NestedError = require('nested-error');

var userAgent = [
	'readme/' + require('./package.json').version,
	'request/' + require('request/package.json').version,
	'nodejs/' + process.version
].join(' ');


var database = process.argv[2] || "http://localhost:5984/readme/";
var now = new Date();


function listFeeds(uri, callback) {
	var req = request({
		uri: uri,
		json: true,
		gzip: true,
		headers: { 'user-agent': userAgent }
	}, function (error, response, body) {
		if (error) return callback(error);
		if (response.statusCode !== 200) return callback(new Error("Unexpected status code " + response.statusCode + " for " + uri));
		callback(null, body);
	});
}

function getFeed(feed, callback) {
	var req = request({
		uri: feed.feed,
		gzip: true,
		headers: { 'user-agent': userAgent }
	});

	req.on('error', function (err) {
		req.abort();
		callback(new NestedError(err));
	});

	req.on('response', function (res) {
		if (res.statusCode !== 200) {
			req.abort();
			return callback(new Error("Unexpected status code " + res.statusCode));
		}

		var feedparser = new FeedParser({ addmeta: false, feedurl: feed.feed });
		req.pipe(feedparser);

		var errors = [];
		var items = [];

		feedparser.on('meta', function (meta) {
		});

		feedparser.on('error', function (err) {
			errors.push(err);
		});

		feedparser.on('readable', function () {
			var item;
			while (item = feedparser.read()) {
				items.push(item);
			}
		});

		feedparser.on('end', function () {
			callback(null, {
				meta: feedparser.meta,
				errors: errors,
				items: items
			});
		});
	});
}

function acceptErrors(callback) {
	return function (err, data) {
		callback(null, {err: err, data: data});
	};
}

function hash(str) {
	var hasher = crypto.createHash('sha1');
	hasher.write(str);
	return hasher.digest('hex');
}

function getAllFeeds(feeds, callback) {
	async.map(
		feeds.rows,
		function (row, callback) {
			var feed = row.value;
			var first_fetch = !feed.date;

			async.waterfall([
				function (callback) { getFeed(feed, acceptErrors(callback)); },
				function (data, callback) {
					if (data.data) console.error("Done with " + (data.data.meta.title || JSON.stringify(data)));
					else console.error("No data.data for " + feed.title);

					if (data.data) {
						var documents = data.data.items.map(function (item) {
							var date = (new Date()).toISOString();
							try { date = (item.date || item.pubdate || data.data.meta.date || new Date()).toISOString(); } catch (err) {}
							return {
								_id: hash(item.guid),
								type: "article",
								feed: feed._id,
								guid: item.guid,
								seen: now,
								date: date,
								title: item.title,
								link: item.link,
								description: item.description,
								read: first_fetch
							};
						});

						if (data.data.meta.image && data.data.meta.image.url) {
							data.data.meta.image.url = url.resolve(feed.feed, data.data.meta.image.url);
						}


						var newFeed = JSON.parse(JSON.stringify(feed));
						newFeed.title = data.data.meta.title;
						newFeed.description = data.data.meta.description;
						newFeed.link = data.data.meta.link;
						newFeed.date = feed.date || (data.data.meta.date || new Date()).toISOString();
						newFeed.image = data.data.meta.image;

						function checkUpdated(oldFeed, newFeed) {
							var isUpdated = false;
							for (var key in newFeed) {
								if (typeof newFeed[key] === "object") isUpdated = isUpdated || checkUpdated(oldFeed[key], newFeed[key]);
								else isUpdated = isUpdated || (newFeed[key] !== oldFeed[key]);
							}
							return isUpdated;
						}

						if (checkUpdated(feed, newFeed)) documents.push(newFeed);
					}

					callback(null, documents || []);
				}
			], callback);
		},
		callback
	);
}

function storeDocuments(documentsIn, callback) {
	var documents = documentsIn.reduce(function (a, b) { return a.concat(b); }, [])
	var req = request.post({
		uri: database + "_bulk_docs",
		json: true,
		body: {
			"docs": documents
		},
		headers: {
			"content-type": "application/json"
		}
	}, callback);
}

async.waterfall([
	listFeeds.bind(null, database + "_design/readme/_view/feeds"),
	getAllFeeds,
	storeDocuments
], function (err, data) {
	if (err) {
		console.error(err.stack);
		process.exit(1);
	}
	var newArticles = data.body.filter(function (result) { return result.ok; }).length;
	console.log("New articles written: " + newArticles);
});
