var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    Velocity = require('velocity-animate/velocity'),
    InlineSVG = require('react-inlinesvg'),
    $ = require('jquery');

require('velocity-animate/velocity.ui');
var TransitionGroup = require('../../components/VelocityTransitionGroup.jsx');

var Staff = React.createClass({
	getInitialState: function() {
		return { editable: false   };
	},

	componentWillMount: function() {
		this.setState(this.props);
	},

	bookAppointment: function(staff) {
		console.log("Header bookAppointment");
		this.props.book_appointment(staff);
	},

	render: function() {
		var self = this;

		var styles = {
			backgroundImage: 'url(' + this.props.image + ')'
		}

		return (
			<div className="staff-member" onClick={this.bookAppointment.bind(this, self.props)} >
				<div className="image" style={styles}></div>
				<h4 className="name">Edit {this.props.first + " " + this.props.last}</h4>
			</div>
		)
		
	}
});

var StaffList = React.createClass({
	getInitialState: function() {
		return { staff: [], current_staff: [], currentFilter: 'all', gettingStaff: false   };
	},

	componentWillMount: function(){
		this.getStaff();
	},
	componentDidMount: function () {},

	updateStaff: function(){
		var self = this;
		self.setState({ gettingStaff: true });
		request
			.post('/api/getstaff')
			.end(function(res) {
				if (res.ok) {
					self.getStaff();
					self.setState({ gettingStaff: false });
				}
		}.bind(self));

	},

	getStaff: function(){
		var self = this;

		request
			.get('/api/staff')
			.end(function(res) {
				if (res.text) {
					var response = JSON.parse(res.text);
					self.setState( { staff: response, current_staff: response } );
				}
		}.bind(self));
	},

	componentWillReceiveProps: function(){
		console.log("StaffList componentWillReceiveProps");
		if (this.props.get_new_staff) {
			console.log(" this.props.get_new_staff.id");
			this.getStaff();
		}
	},

	filterAll: function(){
		var self = this;
		var all = self.state.staff;
		self.setState({ current_staff: all, currentFilter: 'all' });
	},

	filterHair: function(){
		var self = this;
		var hair = self.state.staff.filter(function(staff){
			return staff.hair;
		});
		self.setState({ current_staff: hair, currentFilter: 'hair' });
	},

	filterMassage: function(){
		var self = this;
		var massage = self.state.staff.filter(function(staff){
			return staff.massage;
		});
		self.setState({ current_staff: massage, currentFilter: 'massage' });
	},

	filterNails: function(){
		var self = this;
		var nails = self.state.staff.filter(function(staff){
			return staff.nails;
		});
		self.setState({ current_staff: nails, currentFilter: 'nails' });
	},

	filterSkin: function(){
		var self = this;
		var skin = self.state.staff.filter(function(staff){
			return staff.skin;
		});
		self.setState({ current_staff: skin, currentFilter: 'skin' });
	},

	filterGroup: function(){
		var self = this;
		var group = self.state.staff.filter(function(staff){
			return staff.group;
		});
		self.setState({ current_staff: group, currentFilter: 'group' });
	},

	bookAppointment: function(staff) {
		this.props.book_appointment(staff);
	},

	render: function() {
		var self = this;
			current = self.state.currentFilter,
			gettingStaff = self.state.gettingStaff;
		var staffMembers = self.state.current_staff.map(function(object) {
			
			var bio;
			if (object.Bio === '[object Object]') {
				bio = '';
			} else {
				bio = object.Bio;
			}

			return <Staff 
				id={object.ID}
				key={object.ID}
				first={object.FirstName} 
				last={object.LastName} 
				image={object.ImageURL}
				bio={bio}
				hair={object.hair}
				massage={object.massage}
				nails={object.nails}
				skin={object.skin}
				group={object.group}
				phone={object.MobilePhone}
    			email={object.Email}
    			published={object.published}
    			book_appointment={self.bookAppointment} />
		});

		return (
			<div className="staff-container section" id="crew">
				<h2 className="section_title">Our Crew</h2>

				{ gettingStaff ? <p className="submit_button" ><i className="fa fa-circle-o-notch fa-spin"></i></p> : <p className="submit_button" onClick={self.updateStaff}>Update Staff from Mind Body</p> }
				<div className="staff-controls">
					<span className={ current == 'all' ? "staff-control active" : "staff-control"} onClick={self.filterAll}>All</span>
					<span className="dot">•</span>
					<span className={ current == 'hair' ? "staff-control active" : "staff-control"} onClick={self.filterHair}>Hair</span>
					<span className="dot">•</span>
					<span className={ current == 'massage' ? "staff-control active" : "staff-control"} onClick={self.filterMassage}>Massage</span>
					<span className="dot">•</span>
					<span className={ current == 'nails' ? "staff-control active" : "staff-control"} onClick={self.filterNails}>Nails</span>
					<span className="dot">•</span>
					<span className={ current == 'skin' ? "staff-control active" : "staff-control"} onClick={self.filterSkin}>Skin</span>
					<span className="dot">•</span>
					<span className={ current == 'group' ? "staff-control active" : "staff-control"} onClick={self.filterGroup}>Group Service</span>
				</div>
				<TransitionGroup transitionName="default" className="staff-list" component="div">
			    	{staffMembers}
			    </TransitionGroup>
			</div>
		)
	}
});

var Header = React.createClass({
	getInitialState: function() {
		return { top: false };
	},

	bookAppointment: function() {
		this.props.book_appointment();
	},
	render: function() {
		var self = this;
		var top = self.state.top;
		return (
			<div className="header" >
				<a href="/logout" className="link"><span>Logout</span></a>
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

var Sidebar = React.createClass({
	getInitialState: function() {
		return { bioVisible: false, bookNow: false  };
	},

	componentWillMount: function() {
		this.setState(this.props.staff);
	},

	componentDidMount: function () { 
		var self = this;
		Velocity(
		  self.refs.staffwrapper.getDOMNode(), 
		  "transition.slideUpBigIn",
		  { display: "table-cell", duration: 300, delay: 0 }
		);
	}, 

	showBio: function() {
		this.setState({bioVisible: !this.state.bioVisible});
	},
	showBook: function() {
		this.setState({bookNow: !this.state.bookNow});
	},
	closeSidebar: function() {
		this.props.close_sidebar();
	},

	handleHairChange: function(event) {
		this.setState({hair: !this.state.hair});
	},

	handleMassageChange: function(event) {
		this.setState({massage: !this.state.massage});
	},

	handleNailsChange: function(event) {
		this.setState({nails: !this.state.nails});
	},

	handleSkinChange: function(event) {
		this.setState({skin: !this.state.skin});
	},

	handleGroupChange: function(event) {
		this.setState({group: !this.state.group});
	},

	handlePublishedChange: function(event) {
		this.setState({published: !this.state.published});
	},

	handleBio: function(event) {
		this.setState({ bio: event.target.value });
	},

	submit: function(){
		var self = this;
		var tmp_staff = self.state;
		console.log("Sidebar submit");
		request
		  	.post('/api/staff/'+self.state.id+'/edit')
		  	.send(tmp_staff)
		  	.end(function(res) {
		    	console.log(res)
		    	if (res.text) {
		    		self.props.close_sidebar();
		    		self.props.new_staff(res.body);
		    		console.log(" request ok");
		    	}
		 }.bind(self));
	},

	render: function() {
		var self = this;

		var styles = {
			backgroundImage: 'url(' + self.props.staff.image + ')'
		}
		var bio = self.state.bio;
		var hair = self.state.hair;
		var massage = self.state.massage;
		var nails = self.state.nails;
		var skin = self.state.skin;
		var group = self.state.group;
		var published = self.state.published;

		return (
			<div className="sidebar">
				<div className="staff-wrapper" ref="staffwrapper">
					<div className="staff_container">
						<span className="close_staff" onClick={self.closeSidebar}>×</span>
							<div className="top_staff">
								<div className="image" style={styles}></div>
								<div className="contact">
									<h4 className="name">{self.state.first + " " + self.state.last}</h4>
									<h5 className="home">Hair: <input type="checkbox" checked={hair} onChange={this.handleHairChange} /></h5>
									<h5 className="home">Massage: <input type="checkbox" checked={massage} onChange={this.handleMassageChange} /></h5>
									<h5 className="home">Nails: <input type="checkbox" checked={nails} onChange={this.handleNailsChange} /></h5>
									<h5 className="home">Skin: <input type="checkbox" checked={skin} onChange={this.handleSkinChange} /></h5>
									<h5 className="home">Group: <input type="checkbox" checked={group} onChange={this.handleGroupChange} /></h5>
									<h5 className="home">Published: <input type="checkbox" checked={published} onChange={this.handlePublishedChange} /></h5>
								</div>
							</div>
					</div>
					<div className="staff_container detail_container">
						<h3>Biography</h3>
						<textarea name="description" value={bio} onChange={this.handleBio} />

						<p className="submit_button" onClick={self.submit}>Submit</p>
					</div>
					<div className="sidebar_overlay" onClick={self.closeSidebar}></div>
				</div>
			</div>
		)
	}
});

var VV = React.createClass({
	getInitialState: function() {
		return { sidebar: false, top: false, newStaff: {} };
	},

	openSidebar: function(staff) {
		this.setState({ sidebar: true, staff: staff});
	},

	closeSidebar: function(staff) {
		this.setState({ sidebar: false, staff: null});
	},

	getNewStaff: function(staff){
		console.log("VV getNewStaff");
		this.setState({ newStaff: staff });
	},

	componentDidMount: function(){ },

	render: function() {
		var self = this;
		var sidebar = self.state.sidebar,
			top = self.state.top,
			newStaff = self.state.newStaff;

		var top_class = "admin main top";
		if (sidebar) { top_class += " sidebar-open"; }	
		return (
			<span className={ top_class }>

				<Header />

				<StaffList book_appointment={this.openSidebar} get_new_staff={newStaff} />

				{self.state.sidebar ? 
					<Sidebar staff={self.state.staff} close_sidebar={this.closeSidebar} new_staff={self.getNewStaff}/> : null 
				}

				<Footer />
			</span>
		)
	}
});

React.render(
  <VV />,
  document.body
);