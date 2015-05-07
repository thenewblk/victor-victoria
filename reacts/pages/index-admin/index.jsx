var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    Velocity = require('velocity-animate/velocity'),
    InlineSVG = require('react-inlinesvg'),
    ScrollMonitor = require('scrollmonitor');

var Staff = React.createClass({
	getInitialState: function() {
		return { editable: false   };
	},

	componentWillMount: function() {
		this.setState(this.props);
	},

	edit: function() {
		this.setState({ editable: true })
	},

	handleHairChange: function(event) {
		console.log('handleHairChange: '+event.target.value);
		this.setState({hair: !this.state.hair});
	},

	handleMassageChange: function(event) {
		console.log('handleMassageChange: '+event.target.value);
		this.setState({massage: !this.state.massage});
	},

	handleNailsChange: function(event) {
		console.log('handleNailsChange: '+event.target.value);
		this.setState({nails: !this.state.nails});
	},

	handleSkinChange: function(event) {
		console.log('handleSkinChange: '+event.target.value);
		this.setState({skin: !this.state.skin});
	},

	handleGroupChange: function(event) {
		console.log('handleGroupChange: '+event.target.value);
		this.setState({group: !this.state.group});
	},

	handlePublishedChange: function(event) {
		console.log('handlePublishedChange: '+event.target.value);
		this.setState({published: !this.state.published});
	},

	submit: function(){
		var self = this;
		var tmp_staff = self.state;

		console.log('editContent: '+util.inspect(self.state));
		// self.setState({submitted: true});

		request
		  	.post('/api/staff/'+self.state.id+'/edit')
		  	.send(tmp_staff)
		  	.end(function(res) {
		    	console.log(res)
		    	if (res.text) {
		    		self.setState({ editable: false });
		    	}
		 }.bind(self));
	},

	render: function() {
		var self = this;

		var styles = {
			backgroundImage: 'url(' + this.props.image + ')'
		}

		if (self.state.editable) {
			var hair = self.state.hair;
			var massage = self.state.massage;
			var nails = self.state.nails;
			var skin = self.state.skin;
			var group = self.state.group;
			var published = self.state.published;

			return (
				<div className="staff-member">
					<div className="image" style={styles}></div>
					<h4 className="name">{this.props.first + " " + this.props.last}</h4>

					<h5 className="home">Hair: <input type="checkbox" checked={hair} onChange={this.handleHairChange} /></h5>
					<h5 className="home">Massage: <input type="checkbox" checked={massage} onChange={this.handleMassageChange} /></h5>
					<h5 className="home">Nails: <input type="checkbox" checked={nails} onChange={this.handleNailsChange} /></h5>
					<h5 className="home">Skin: <input type="checkbox" checked={skin} onChange={this.handleSkinChange} /></h5>
					<h5 className="home">Group: <input type="checkbox" checked={group} onChange={this.handleGroupChange} /></h5>
					<h5 className="home">Published: <input type="checkbox" checked={published} onChange={this.handlePublishedChange} /></h5>

					<p className="submit_button" onClick={self.submit}>Submit</p>
				</div>
			)
		} else {
			return (
				<div className="staff-member">
					<div className="image" style={styles}></div>
					<h4 className="name">{this.props.first + " " + this.props.last}</h4>
					<p className="edit_button" onClick={self.edit}>Edit</p>
				</div>
			)
		}
	}
});

var StaffList = React.createClass({
	getInitialState: function() {
		return { staff: [], current_staff: [] };
	},

	componentWillMount: function(){
		var self = this;
		request
			.get('/api/staff')
			.end(function(res) {
				if (res.text) {
					var response = JSON.parse(res.text);
					console.log(response);
					self.setState( { staff: response, current_staff: response } );
				}
		}.bind(self));
	},

	filterAll: function(){
		var self = this;
		var all = self.state.staff;
		self.setState({ current_staff: all });
	},

	filterHair: function(){
		var self = this;
		var hair = self.state.staff.filter(function(staff){
			return staff.hair;
		});
		self.setState({ current_staff: hair });
	},

	filterMassage: function(){
		var self = this;
		var massage = self.state.staff.filter(function(staff){
			return staff.massage;
		});
		self.setState({ current_staff: massage });
	},

	filterNails: function(){
		var self = this;
		var nails = self.state.staff.filter(function(staff){
			return staff.nails;
		});
		self.setState({ current_staff: nails });
	},

	filterSkin: function(){
		var self = this;
		var skin = self.state.staff.filter(function(staff){
			return staff.skin;
		});
		self.setState({ current_staff: skin });
	},

	filterGroup: function(){
		var self = this;
		var group = self.state.staff.filter(function(staff){
			return staff.group;
		});
		self.setState({ current_staff: group });
	},

	render: function() {
		var self = this;
		var staffMembers = self.state.current_staff.map(function(object) {
			return <Staff 
				first={object.FirstName} 
				last={object.LastName}

				hair={object.hair} 
				nails={object.nails} 
				massage={object.massage} 
				published={object.published} 
				group={object.group} 
				skin={object.skin} 


				id={object.ID} 
				image={object.ImageURL}
				bio={object.Bio} />
		});

		return (
			<div className="staff-container" id="crew">
				<div className="staff-controls">
					<span className="staff-control" onClick={self.filterAll}>All</span>
					<span className="staff-control" onClick={self.filterHair}>Hair</span>
					<span className="staff-control" onClick={self.filterMassage}>Massage</span>
					<span className="staff-control" onClick={self.filterNails}>Nails</span>
					<span className="staff-control" onClick={self.filterSkin}>Skin</span>
					<span className="staff-control" onClick={self.filterGroup}>Group</span>
				</div>
				<div className="staff-list">
					{staffMembers}
				</div>
			</div>
		)
	}
});

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
				<a href="#top" className="cmn-toggle-switch cmn-toggle-switch__htla">
				  <span>toggle menu</span>
				</a>
				<a href="#crew" id="crew-link" className="link"><span>Crew</span></a>
				<span className="dot">•</span>
				<a href="#packages" id="package-link" className="link"><span>Packages</span></a>
				<span className="dot">•</span>
				<a href="#photogallery" id="photogallery-link" className="link" ><span>Place</span></a>
				<span className="dot">•</span>
				<a href="#instagrams" id="instagrams-link" className="link"><span>#victorvictoriasalon</span></a>
				<span className="dot">•</span>
				<a href="#footer" id="footer-link" className="link"><span>Contact</span></a>
				<span className="dot">•</span>
				<a href="/logout" className="link"><span>Logout</span></a>
				<span className="link appointment" onClick={this.bookAppointment}>Book an Appointment <span className="close">×</span></span>
			</div>
		)
	}
});

var Footer = React.createClass({
	getInitialState: function() {
		return {   };
	},

	render: function() {
		return (
			<div className="footer">
				<div className="container">
					<p>Formerly Sirens Salon <span className="pink">| Now Booth Rental</span></p>
					<p><a className="links" href="https://www.google.com/maps/dir//1105+Howard+St,+Omaha,+NE+68102/@41.25514,-95.931001,15z/data=!4m13!1m4!3m3!1s0x87938faf66372967:0x2daeb55700b0c1dc!2s1105+Howard+St,+Omaha,+NE+68102!3b1!4m7!1m0!1m5!1m1!1s0x87938faf66372967:0x2daeb55700b0c1dc!2m2!1d-95.931001!2d41.25514" target="_blank">1105 Howard Street Omaha, NE 68132</a></p>
					<p><a className="links" href="mailto:info@victorvictoriasalon.com">info@victorvictoriasalon.com</a></p>
					<p><a className="links" href="tel:4029339333">402-933-9333</a></p>
					<img className="logomark" src="/img/svg/logomark_dark.svg" />
				</div>
			</div>
		)
	}
});

var PhotoGallery = React.createClass({
	getInitialState: function() {
		return {   };
	},

	render: function() {

		var image1 = {
			backgroundImage: 'url(/img/photo/2015BryceBridges_1632_edit.jpg)'
		};

		var image2 = {
			backgroundImage: 'url(/img/photo/2015BryceBridges_1544_edit.jpg)'
		};

		var image3 = {
			backgroundImage: 'url(/img/photo/2015BryceBridges_1542_edit.jpg)'
		};
		
		var image4 = {
			backgroundImage: 'url(/img/photo/2015BryceBridges_1585_edit.jpg)'
		};

		return (
			<div className="photogallery clear">
				<div className="left">
					<div className="image image1" style={image1}></div>
		
					<div className="vv_logo">
						<img className="logomark" src="/img/svg/logomark_white.svg" />
					</div>
					<div className="image image2" style={image2}></div>
				</div>
				<div className="right">
					<div className="image image3" style={image3}></div>
					<div className="image image4" style={image4}></div>
				</div>

			</div>
		)
	}
});

var element, watcher;

var VV = React.createClass({
	getInitialState: function() {
		return { sidebar: false, top: false };
	},
	openSidebar: function() {
		console.log("VV openSidebar");
		var sidebar = this.state.sidebar;
		this.setState({ sidebar: !sidebar});
	},

	componentDidMount: function(){
		console.log('componentDidMount');
		var self = this; 

		element = document.getElementById("crew");;
 		
		watcher = ScrollMonitor.create( element );
		
		if (watcher.isAboveViewport) {
			console.log('watcher.isAboveViewport');
			self.setState({top: true})
		}
		
		watcher.stateChange(function() {
			console.log('stateChange') ;
			console.log(' this.isAboveViewport: ' + this.isAboveViewport) ;

			self.setState({top: this.isAboveViewport});
		});


	},

	render: function() {
		var self = this;
		var sidebar = self.state.sidebar,
			top = self.state.top;

		var top_class = "main";
		if (top) { top_class += " top"; }	
		if (sidebar) { top_class += " sidebar-open"; }	
		return (
			<span className={ top_class }>

				<Header />

				<StaffList />

				<PhotoGallery />

				<Footer />
			</span>
		)
	}
});

React.render(
  <VV />,
  document.body
);