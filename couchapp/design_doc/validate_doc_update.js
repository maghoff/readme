function (newDoc, oldDoc, userCtx, secObj) {
	if (newDoc.type === "feed") {
		if (typeof newDoc.feed !== "string") throw({forbidden: "feed objects must have a feed URL"});
		if (!newDoc.feed.match(/^https?:\/\//)) throw({forbidden: "feed scheme must be http or https"});
	} else if (newDoc.type === "article") {
	} else {
		throw({forbidden: 'type must be "feed" or "article"'});
	}
}
