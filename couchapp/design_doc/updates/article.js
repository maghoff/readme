function (doc, req) {
	var config = JSON.parse(req.body);
	if (config.hasOwnProperty("read")) doc.read = !!config.read;
	return [ doc, { headers: { "content-type": "application/json" }, body: JSON.stringify({ok:true}) } ];
}
