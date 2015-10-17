function(doc) {
	if (doc.type === "article") {
		emit([ doc.seen || doc.date, doc._id ], { _id: doc.feed, article: doc });
	}
}
