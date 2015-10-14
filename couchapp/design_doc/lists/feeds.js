function (head, req) {
	var React = require('react/addons');

	start({
		headers: {
			'content-type': 'text/html; charset=utf-8'
		}
	});

	send(this.templates["feeds.mu"]);

	var row;
	while (row = getRow()) {
		send("<a href='feed/" + row.value._id + "'>"+row.value.title+"</a>");
	}
}
