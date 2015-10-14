function (doc, req) {
	start({ 'content-type': 'text/html; charset=utf8' });
	send(doc.description || doc.summary || doc.title);
}
