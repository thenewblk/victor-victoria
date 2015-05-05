var React = require('react');

var Header = React.createClass({
	getInitialState: function() {
		return { top: false };
	},

	bookAppointment: function() {
		console.log("Header bookAppointment");
		this.props.book_appointment();
	},
	render: function() {
		var self = this;
		var top = self.state.top;
		return (
			<div className="header" >
				<a href="#crew" id="crew-link" className="link">Crew</a>
				<span className="dot">•</span>
				<a href="#packages" id="package-link" className="link">Packages</a>
				<span className="dot">•</span>
				<a href="#photogallery" id="photogallery-link" className="link" >Place</a>
				<span className="dot">•</span>
				<a href="#footer" className="link">Contact</a>
				<span className="link appointment" onClick={this.bookAppointment}>Book an Appointment <span className="close">×</span></span>
			</div>
		)
	}
});