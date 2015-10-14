function (doc, req) {
	var config = JSON.parse(req.body);
	if (config.hasOwnProperty("open_linked")) doc.open_linked = !!config.open_linked;
	return [ doc, { headers: { "content-type": "application/json" }, body: JSON.stringify({ok:true}) } ];
}
