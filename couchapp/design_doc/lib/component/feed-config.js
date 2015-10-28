var React = require('lib/react');

module.exports = React.createClass({
	handleClick: function (ev) {
		this.props.setItem("open_mode", ev.target.value);
	},
	render: function () {
		return React.createElement("div", { className: "configItem" },
			React.createElement("h1", null, "When displaying articles from this feed..."),
			React.createElement("div", { className: "buttonList" },
				React.createElement("button",
					{
						className: "button" + ((this.props.feed.open_mode || "description") === "description" ? " selected" : ""),
						value: "description",
						onClick: this.handleClick
					},
					"Show description from feed"),
				React.createElement("button",
					{
						className: "button" + (this.props.feed.open_mode === "embed_linked" ? " selected" : ""),
						value: "embed_linked",
						onClick: this.handleClick
					},
					"Embed linked article"),
				React.createElement("button",
					{
						className: "button" + (this.props.feed.open_mode === "open_linked" ? " selected" : ""),
						value: "open_linked",
						onClick: this.handleClick
					},
					"Open linked article")
			),
			React.createElement("h1", null, "Administer subscription"),
			React.createElement("div", { className: "buttonList" },
				React.createElement("button",
					{
						className: "button buttonDanger",
						onClick: this.props.unsubscribe
					},
					"Unsubscribe")
			)
		);
	}
});
