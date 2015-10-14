function(doc) {
	if (doc.type === "article") {
		emit([ doc.date, doc._id ], { _id: doc.feed, article: doc });
	}
}
