function (head, req) {
	start({ headers: { 'content-type': 'application/json' }});
	send('[');
	var row;
	if (row = getRow()) send(JSON.stringify({id:row.doc._id, rev:row.doc._rev}));
	while (row = getRow()) send("," + JSON.stringify({id:row.doc._id, rev:row.doc._rev}));
	send(']');
}
