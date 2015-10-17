function (head, req) {
	var React = require('lib/react');

	start({
		headers: {
			'content-type': 'text/html; charset=utf-8'
		}
	});

	send(require('templates/feeds')());

	var row;
	send("<ul class=feeds>");
	while (row = getRow()) {
		send("<li><a href='feed/" + row.value._id + "'>"+row.value.title+"</a></li>");
	}
	send("</ul>");
}
