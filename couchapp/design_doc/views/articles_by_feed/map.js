function(doc) {
	if (doc.type === "feed") {
		emit([ doc._id, {} ], null);
	} else if (doc.type === "article") {
		emit([ doc.feed, doc.seen || doc.date, doc._id ], null);
	}
}
