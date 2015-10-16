function (doc, req) {
	var config = JSON.parse(req.body);
	if (config.hasOwnProperty("open_mode")) doc.open_mode = config.open_mode;
	return [ doc, { headers: { "content-type": "application/json" }, body: JSON.stringify({ok:true}) } ];
}
