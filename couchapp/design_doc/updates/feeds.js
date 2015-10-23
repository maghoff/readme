function (doc, req) {
	if (!req.headers["Content-Type"].match(/^application\/x-www-form-urlencoded\s*(;.*)?$/)) {
		return [null, { code: 500, body: "Content-Type must be application\/x-www-form-urlencoded" }];
	}

	return [
		{
			_id: req.uuid,
			type: "feed",
			feed: req.form.url
		},
		{
			code: 302,
			headers: {
				"Content-Type": "text/plain",
				"Location": "feeds"
			},
			body: "Feed added"
		}
	];
}
