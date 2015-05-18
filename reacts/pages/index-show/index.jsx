var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    Velocity = require('velocity-animate/velocity'),
    InlineSVG = require('react-inlinesvg'),
    ScrollMonitor = require('scrollmonitor'),
    $ = require('jquery');

require('velocity-animate/velocity.ui');
var TransitionGroup = require('../../components/VelocityTransitionGroup.jsx');

var element, watcher;

var VV = React.createClass({
	getInitialState: function() {
		return { sidebar: false, top: false };
	},
	openSidebar: function(staff) {
		this.setState({ sidebar: true, staff: staff});
	},

	closeSidebar: function(staff) {
		this.setState({ sidebar: false, staff: null});
	},

	componentDidMount: function(){
		console.log('componentDidMount');
		var self = this; 

		element = document.getElementById("crew");
 		
		watcher = ScrollMonitor.create( element, 75 );
		// var crew_link = $("#crew-link");

		if (watcher.isAboveViewport) {
			console.log('watcher.isAboveViewport');
			self.setState({top: true})
		}
		
		watcher.stateChange(function() {
			self.setState({top: this.isAboveViewport});
		});


	},

	render: function() {
		var self = this;
		var sidebar = self.state.sidebar,
			top = self.state.top;

		var top_class = "main";
		if (top) { top_class += " top"; }	
		if (sidebar) { 
			$('body').addClass('noscroll'); 
		} else { 
			$('body').removeClass('noscroll');
		}	

		return (
			<span className={ top_class }>

				<Header book_appointment={this.openSidebar} />
				
				<section className="top" id="top">
					<video className="video-wrap" poster="/img/photo/2015BryceBridges_1508_edit.jpg" autoPlay muted loop >
						<source src="/video/video.mp4" type="video/mp4" />
					</video>
					<div className="logo-wrap">
						<div className="logo-cell">
							<img className="wordmark" src="/img/svg/wordmark.svg" />
						</div>
					</div>
					<div className="header-curves clear">
						<div className="left"></div>
						<div className="right"></div>
					</div>
				</section>

				<StaffList book_appointment={this.openSidebar} />

				<PackageList />

				<PhotoGallery />

				<InstagramList />

				{self.state.sidebar ? 
					<Sidebar staff={self.state.staff} close_sidebar={this.closeSidebar}/> : null 
				}

				<Footer />
			</span>
		)
	}
});

var Header = React.createClass({
	getInitialState: function() {
		return { top: false, windowWidth: window.innerWidth };
	},

    componentDidMount: function(){
    	var self = this;
      window.addEventListener('resize', this.handleResize);
      $('a[href*=#]:not([href=#])').click(function() {
	      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	        var target = $(this.hash);
	        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	        if (target.length) {
	          $('html,body').stop().animate({
	            scrollTop: target.offset().top
	          }, 1000);
	          $('.navigation').removeClass('active');
	          $('.navigation-items').removeClass('active');
	          self.clickMenu();
	          return false;
	        }
	      }
	  });
    },

    handleResize: function(e) {
    	this.setState({windowWidth: window.innerWidth});
    },

	bookAppointment: function() {
		console.log("Header bookAppointment");
		this.props.book_appointment();
	},

	clickMenu: function(){
		console.log("clickMenu");
		var self = this;
		if(self.state.windowWidth < 769){
			self.setState({top: !self.state.top});
		}
	},

	render: function() {
		var self = this;
		var top = self.state.top;
		if (top){
			var button_class = "tcon tcon-menu--xcross tcon-transform";
			var header_class = "header open"
		} else {
			var button_class = "tcon tcon-menu--xcross";
			var header_class = "header"
		}
		return (
			<div className={header_class} >
				<button type="button" className={button_class} onClick={self.clickMenu} aria-label="toggle menu">
				  <span className="tcon-menu__lines" aria-hidden="true"></span>
				  <span className="tcon-visuallyhidden">toggle menu</span>
				</button>
				<span className="menu-container">
					<a href="#top" className="cmn-toggle-switch cmn-toggle-switch__htla">
					  <span>toggle menu</span>
					</a>
					<a href="#crew" id="crew-link" className="link"><span>Crew</span></a>
					<a href="#packages" id="package-link" className="link"><span>Packages</span></a>
					<a href="#photogallery" id="photogallery-link" className="link"><span>Place</span></a>
					<a href="#instagrams" id="instagrams-link" className="link"><span>#victorvictoriasalon</span></a>
					<a href="#footer" id="footer-link" className="link"><span>Contact</span></a>
				</span>

				<span className="link appointment" onClick={this.bookAppointment}>Book an Appointment <span className="close">×</span></span>
			</div>
		)
	}
});

var Sidebar = React.createClass({
	getInitialState: function() {
		return { bioVisible: false, bookNow: false  };
	},
	showBio: function() {
		this.setState({bioVisible: !this.state.bioVisible});
	},
	showBook: function() {
		this.setState({bookNow: !this.state.bookNow});
	},
	closeSidebar: function() {
		console.log("Header bookAppointment");
		this.props.close_sidebar();
	},
	componentDidMount: function () { 
		var self = this;
		Velocity(
		  self.refs.staffwrapper.getDOMNode(), 
		  "transition.slideUpBigIn",
		  { display: "table-cell", duration: 300, delay: 0 }
		);
	}, 
	render: function() {
		var self = this;
		if (self.props.staff) {
			var styles = {
				backgroundImage: 'url(' + self.props.staff.image + ')'
			}
			var bio = self.props.staff.bio;
			return (
				<div className="sidebar">
					<div className="staff-wrapper" ref="staffwrapper">
						<div className="staff_container">
							<span className="close_staff" onClick={self.closeSidebar}>×</span>
							<div className="top_staff">
								<div className="image" style={styles}></div>
								<div className="contact">
									<h4 className="name">{self.props.staff.first + " " + self.props.staff.last}</h4>
									{ (self.props.staff.phone) ? <p><a href="tel:{self.props.staff.phone}"><i className="fa fa-phone"></i> {self.props.staff.phone}</a></p> : null }
									{ (self.props.staff.email) ? <p><a href="mailto:{self.props.staff.email}"><i className="fa fa-envelope-o"></i>{self.props.staff.email}</a></p> : null }

									<div className="book_now">
										{ (self.state.bookNow) ?
											<span className="book_button" onClick={self.showBook}>Biography</span> :
											<span className="book_button" onClick={self.showBook}>Book Now</span>
										}
										<a className="app_icon" href="https://itunes.apple.com/us/app/mindbody-connect/id689501356?mt=8">
											<img src="/img/app_store.png" />
										</a>
										<a className="app_icon" href="https://play.google.com/store/apps/details?id=com.mindbodyonline.connect">
											<img src="/img/google_play.png" />
										</a>
									</div>
									<div className="tags">
										<span className="services">Services: </span>
										{ (self.props.staff.hair) ? 'Hair' : null }
										{ (self.props.staff.nails) ? 'nails' : null }
										{ (self.props.staff.massage) ? 'massage' : null }
										{ (self.props.staff.skin) ? 'skin' : null }
										{ (self.props.staff.group) ? 'group' : null }
									</div>
								</div>
							</div>
						</div>
						<div className="staff_container detail_container">
							{ (self.state.bookNow) ? 
								<div className="booking">
									<iframe src="https://widgets.healcode.com/iframe/appointments/c610568aec1/" frameBorder="0"></iframe>
								</div>
							:
								<div className="details">
									{ (self.props.staff.bio) ? 
										<span  className="bio">
											<h3>Biography</h3>
											<div dangerouslySetInnerHTML={{__html: bio}} />
										</span>
									: null }
								</div>
							}
						</div>
						<div className="sidebar_overlay" onClick={self.closeSidebar}></div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="sidebar">
					<div className="staff-wrapper" ref="staffwrapper">
						<div className="staff_container detail_container">
							<span className="close_staff" onClick={self.closeSidebar}>×</span>
							<div className="booking">
								<iframe src="https://widgets.healcode.com/iframe/appointments/c610568aec1/" frameBorder="0"></iframe>
							</div>
						</div>
						<div className="sidebar_overlay" onClick={self.closeSidebar}></div>
					</div>
				</div>
			)
		}
	}
});

var Staff = React.createClass({
	getInitialState: function() {
		return { bioVisible: false, bookNow: false  };
	},

	showBio: function() {
		this.setState({bioVisible: !this.state.bioVisible});
	},

	showBook: function() {
		this.setState({bookNow: !this.state.bookNow});
	},

	bookAppointment: function(staff) {
		console.log("Header bookAppointment");
		this.props.book_appointment(staff);
	},

	render: function() {
		var self = this;

		var styles = {
			backgroundImage: 'url(' + self.props.image + ')'
		}

		return (
			<div className="staff-member" onClick={this.bookAppointment.bind(this, self.props)}>
				<div className="image" style={styles}></div>
				<h4 className="name">{self.props.first + " " + self.props.last}</h4>
			</div>
		)
		
	}
});

var StaffList = React.createClass({
	getInitialState: function() {
		return { staff: [], current_staff: [], currentFilter: 'all' };
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
	componentDidMount: function () {

	  	var crew = document.getElementById("crew");
	  	var crew_link = $("#crew-link");

		var crewWatcher = ScrollMonitor.create( crew, {top: 75, bottom: -5} );

		crewWatcher.stateChange(function() {
			if( this.isAboveViewport && this.isInViewport ) {
				crew_link.addClass('active');
			} else {
				crew_link.removeClass('active');
			}
		});
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
		console.log("Header bookAppointment");
		this.props.book_appointment(staff);
	},

	render: function() {
		var self = this;
			current = self.state.currentFilter;
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
    			book_appointment={self.bookAppointment} />
		});

		return (
			<div className="staff-container section" id="crew">
				<h2 className="section_title">Our Crew</h2>
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

var Footer = React.createClass({
	getInitialState: function() {
		return {   };
	},

	render: function() {
		return (
			<div className="footer" id="footer">
				<div className="container">
					<img className="logomark" src="/img/svg/logomark_dark.svg" />
					<p>Formerly Sirens Salon <span className="pink">| Now Booth Rental</span></p>
					<p><a className="links" href="https://www.google.com/maps/dir//1105+Howard+St,+Omaha,+NE+68102/@41.25514,-95.931001,15z/data=!4m13!1m4!3m3!1s0x87938faf66372967:0x2daeb55700b0c1dc!2s1105+Howard+St,+Omaha,+NE+68102!3b1!4m7!1m0!1m5!1m1!1s0x87938faf66372967:0x2daeb55700b0c1dc!2m2!1d-95.931001!2d41.25514" target="_blank"><i className="fa fa-map-marker"></i>1105 Howard Street Omaha, NE 68102</a></p>
					<p><a className="links" href="mailto:info@victorvictoriasalon.com"><i className="fa fa-envelope-o"></i>info@victorvictoriasalon.com</a></p>
					<p><a className="links" href="tel:4029339333"><i className="fa fa-phone"></i>402-933-9333</a></p>
					
				</div>
			</div>
		)
	}
});

var PhotoGallery = React.createClass({
	getInitialState: function() {
		return {   };
	},

	componentDidMount: function () {

		var photogallery = document.getElementById("photogallery");
		var photogallery_link = $("#photogallery-link");

		var photogalleryWatcher = ScrollMonitor.create( photogallery, {top: 75, bottom: -5} );

		photogalleryWatcher.stateChange(function() {
			if( this.isAboveViewport && this.isInViewport ) {
				photogallery_link.addClass('active');
			} else {
				photogallery_link.removeClass('active');
			}
		});

	},


	render: function() {

		return (
			<div className="photogallery clear section" id="photogallery">
				<h2 className="section_title">The Place</h2>
				<div className="photogallery-wrap">
					<div className="left">
						<img className="place_image one" src="/img/photo/1.png" />
						<img className="place_image two" src="/img/photo/2.png" />
						<img className="place_image three" src="/img/photo/3.png" />
					</div>
					<div className="middle">
						<img className="place_image four" src="/img/photo/4.png" />
						<img className="place_image five" src="/img/photo/5.png" />
					</div>
					<div className="right">
						<img className="place_image six" src="/img/photo/6.png" />
						<img className="place_image seven" src="/img/photo/7.png" />
					</div>
				</div>

			</div>
		)
	}
});

var Instagram = React.createClass({
  getInitialState: function() {
    return {
      className: 'loading',
    };
  },
  componentDidMount: function () {},

  componentWillMount: function(){
    var self = this;
    var my_image = new Image();
    my_image.onload = this.onLoad;
    my_image.src = self.props.images.standard_resolution.url;
  },



  onLoad: function() {
    var self = this;
    self.setState({className: "loaded"});

  },


  render: function() {
    var self = this;
    var userCaption = (self.props.caption.length > 160 ? self.props.caption.slice(0, 160) + ' ...' : self.props.caption);
    // var userCaption = self.props.caption;
    var divStyles = {
      backgroundImage: 'url(' + self.props.images.standard_resolution.url + '), url(../img/bkgrd_pattern_DARKBLK.svg)',
    };

    var userStyles = {
      backgroundImage: 'url(' + self.props.user.profile_picture + ')',
    };

    return (
      <div className={"instagram "+self.state.className} style={divStyles}>
        <div className="description">
          <div className="instagram_wrapper">
            <div className="user__profile-picture" style={userStyles}></div>
            <p className="photo__description">{userCaption}</p>
            <p className="instagram__user">
              <a href={self.props.link} target="_blank">
                &#64;{self.props.user.username}
              </a>
            </p>
          </div>
        </div>
        <InlineSVG src="/img/svg/instagram.svg" uniquifyIDs={false}></InlineSVG>
      </div>
    )
  }
});

var InstagramList = React.createClass({
	getInitialState: function() {
		return { instagrams: [] };
	},
	componentWillMount: function(){
		var self = this;

		request
		  .get('/api/instagrams/')
		  .end(function(res) {
		    console.log(res)
		    if (res.text) {
		      var instagrams = JSON.parse(res.text);
		      self.setState({instagrams: instagrams});
		    }
		  }.bind(self));

	},

	componentDidMount: function () {

		var instagrams = document.getElementById("instagrams");
		var instagrams_link = $("#instagrams-link");

		var instagramsWatcher = ScrollMonitor.create( instagrams, {top: 75, bottom: -5} );

		instagramsWatcher.stateChange(function() {
			if( this.isAboveViewport && this.isInViewport ) {
				instagrams_link.addClass('active');
			} else {
				instagrams_link.removeClass('active');
			}
		});

	},

  render: function() {
    var self = this;

    var instagrams = self.state.instagrams.map(function(object) {
      return <Instagram images={object.images} user={object.user} link={object.link} caption={object.caption.text} />
    });

    return (
    	<div className="instagrams-wrap section" id="instagrams">
    		<h2 className="section_title">#victorvictoriasalon</h2>
		    <div className="instagrams">
		        {instagrams}
		    </div>
      	</div>
    )
  }
});

var Package = React.createClass({
  getInitialState: function() {
    return {  };
  },

  render: function() {
    var self = this;
    var price = parseInt(self.props.price);
    var formatted_price = '$' + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    var items = self.props.content.map(function(object) {
      return <li>{object}</li>
    });
    return (
    	<div className="package">
    		<div className="package-wrap">
	    	  <img src={self.props.image} />
		      <ul className="content">
		      	{items}
		      </ul>
		      <p className="price">{formatted_price}</p>
	      	</div>
      	</div>
    )
  }
});

var PackageList = React.createClass({
  getInitialState: function() {
    return {  };
  },

  componentDidMount: function () {

  	var packages = document.getElementById("packages");
  	var package_link = $("#package-link");

	var packageWatcher = ScrollMonitor.create( packages, {top: 75, bottom: -5} );

	packageWatcher.stateChange(function() {
		if( this.isAboveViewport && this.isInViewport ) {
			package_link.addClass('active');
		} else {
			package_link.removeClass('active');
		}
	});

  },

  render: function() {
    var self = this;
    var victor = ['Wash and Style', 'Beard Trim', 'Executive Manicure'],
    	victoria = ['Updo', 'Mineral Makeup', '(Add airbrush for $30)'],
    	victorvictoria = ['Couples Swedish Massage', 'Couples Classic Pedicure', 'Wash and Styles'],
    	treat = ['Hour European Facial', 'Hour Swedish Massage', 'Classic Pedicure', 'Classic Manicure'];


    return (
    	<div className="packages section container" id="packages">
    	  <h2 className="section_title">Your Packages</h2>
    	  <Package image="img/banners/bridal.jpg" price="55" content={victor}/>
    	  <Package image="img/banners/victor.jpg" price="55" content={victor} />
    	  <Package image="img/banners/victoria.jpg" price="100" content={victoria} />
    	  <Package image="img/banners/victorvictoria.jpg" price="305" content={victorvictoria}/>
    	  <Package image="img/banners/treat.jpg" price="240" content={treat}/>
      	</div>
    )
  }
});


React.render(
  <VV />,
  document.body
);