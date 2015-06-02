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
					<video className="video-wrap" poster="/img/video.png" autoPlay muted loop >
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

				<ServiceList />

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
					<a href="#packages" id="package-link" className="link"><span>Services</span></a>
					<a href="#photogallery" id="photogallery-link" className="link"><span>Place</span></a>
					<a href="#instagrams" id="instagrams-link" className="link"><span>#VictorVictoriaSalon</span></a>
					<a href="#footer" id="footer-link" className="link"><span>Contact</span></a>
					<a href="https://clients.mindbodyonline.com/classic/ws?studioid=170562&stype=42" target="_blank" className="link"><span>Gift Certificates</span></a>
				</span>
				<span className="right-side">
					<span className="link phone"><a href="tel:4029339333"><i className="fa fa-phone"></i></a></span>
					<span className="link appointment" onClick={this.bookAppointment}>Book an Appointment <span className="close">×</span></span>
				</span>
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
									<div className="mobile_image" style={styles}></div>
									<h4 className="name">{self.props.staff.first + " " + self.props.staff.last}</h4>
									<p className="call_staff"><a href="tel:4029339333"><i className="fa fa-phone"></i> 402-933-9333</a></p>
									{ (self.props.staff.email) ? <p><a href={"mailto:"+self.props.staff.email }><i className="fa fa-envelope-o"></i>{self.props.staff.email}</a></p> : null }
									<div className="tags">
										<span className="services">Services: </span>
										{ (self.props.staff.hair) ? 'Hair' : null }
										{ (self.props.staff.nails) ? 'nails' : null }
										{ (self.props.staff.massage) ? 'massage' : null }
										{ (self.props.staff.skin) ? 'skin' : null }
										{ (self.props.staff.group) ? 'group' : null }
									</div>
									<div className="book_now">
										{ (self.state.bookNow) ?
											<span className="book_button" onClick={self.showBook}>Biography</span> :
											<span className="book_button" onClick={self.showBook}>Book Now</span>
										}
										<p className="app_description">Book Now with MindBody Connect:</p>
										<span className="app_container">
											<a className="app_icon" href="https://itunes.apple.com/us/app/mindbody-connect/id689501356?mt=8">
												<img src="/img/app_store.png" />
											</a>
											<a className="app_icon" href="https://play.google.com/store/apps/details?id=com.mindbodyonline.connect">
												<img src="/img/google_play.png" />
											</a>
										</span>
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
							<div className="book_now">
								<p className="app_description">Book Now with MindBody Connect:</p>
								<span className="app_container">
									<a className="app_icon" href="https://itunes.apple.com/us/app/mindbody-connect/id689501356?mt=8">
										<img src="/img/app_store.png" />
									</a>
									<a className="app_icon" href="https://play.google.com/store/apps/details?id=com.mindbodyonline.connect">
										<img src="/img/google_play.png" />
									</a>
								</span>
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
					<p><a className="links" href="https://www.google.com/maps/dir//1105+Howard+St,+Omaha,+NE+68102/@41.25514,-95.931001,15z/data=!4m13!1m4!3m3!1s0x87938faf66372967:0x2daeb55700b0c1dc!2s1105+Howard+St,+Omaha,+NE+68102!3b1!4m7!1m0!1m5!1m1!1s0x87938faf66372967:0x2daeb55700b0c1dc!2m2!1d-95.931001!2d41.25514" target="_blank"><i className="fa fa-map-marker"></i>1105 Howard Street Omaha, NE 68102</a></p>
					<p><a className="links" href="mailto:info@victorvictoriasalon.com"><i className="fa fa-envelope-o"></i>info@victorvictoriasalon.com</a></p>
					<p><a className="links" href="tel:4029339333"><i className="fa fa-phone"></i>402-933-9333</a></p>
					
				</div>
			</div>
		)
	}
});

var Photo = React.createClass({
  getInitialState: function() {
    return { current_image: "" };
  },

  componentWillMount: function(){
  	var self = this;
  	var images = self.props.images;
  	if (images.length > 1) {
  		self.swapImage();
  	} else {
  		self.setState({current_image: self.props.images[0]})
  	}
  },

  swapImage: function(){
  	var self = this;
  	var images = self.props.images;
  	var timer = parseInt(self.props.timer);
    var i = 0;
    setInterval(
        function(){
            self.setState({current_image: images[i]});
            i++;
            if(i >= images.length) i = 0;
        }, timer );
  },

  render: function() {
    var self = this;
    var images = self.props.images;
    var all_images = "";
    for (var i = 0; i < images.length; i++) {
    	all_images = all_images + ", url(" + images[i] + ")"; 
    }
 	var style;
    var current_image = self.state.current_image;
    if (current_image.length) {
	    style = {
	    	backgroundImage: 'url(' + current_image + ')' + all_images
	    };
    }
 
    return ( <div className={self.props.className} style={style}></div> )
     
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
		var images
		return (
			<div className="photogallery clear section" id="photogallery">
				<h2 className="section_title">The Place</h2>
				<div className="photogallery-wrap">
					<div className="left">
						<Photo className="place_image one" images={["/img/photogallery/1/aerial.jpg","/img/photogallery/1/flower.jpg"]} timer={2000} />
						<Photo className="place_image two" images={["/img/photogallery/2/frame_detail.jpg", "/img/photogallery/2/frames_wide.jpg" ]} timer={4000} />
						<Photo className="place_image three" images={["/img/photogallery/3/blue_wall.jpg", "/img/photogallery/3/mirror_frames.jpg", "/img/photogallery/3/wash_stations.jpg"]} timer={3000} />
					</div>
					<div className="middle">
						<Photo className="place_image four" images={["/img/photogallery/4/chand_diag.jpg", "/img/photogallery/4/chand_up.jpg", "/img/photogallery/4/single_station.jpg"]} timer={5000} />
						<Photo className="place_image five" images={["/img/photogallery/5/chand_aerial.jpg", "/img/photogallery/5/head_detail.jpg", "/img/photogallery/5/mirror.jpg"]} timer={4500} />
					</div>
					<div className="right">
						<Photo className="place_image six" images={["/img/photogallery/6/head_wide.jpg"]} />
						<Photo className="place_image seven" images={["/img/photogallery/7/pink.jpg", "/img/photogallery/7/wash_stations.jpg"]} timer={4000} />
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
    	<a href={self.props.link} target="_blank">	
			<div className={"instagram "+self.state.className} style={divStyles}>
				<InlineSVG src="/img/svg/instagram.svg" uniquifyIDs={false}></InlineSVG>
			</div>
		</a>
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

	loadMore: function(){
		var self = this;
		var instagrams = self.state.instagrams;

		var instagram_count = instagrams.length;
		request
		  .get('/api/instagrams/'+instagrams.length)
		  .end(function(res) {
		    console.log(res)
		    if (res.text) {
		      var new_instagrams = JSON.parse(res.text);
		      self.setState({instagrams: instagrams.concat(new_instagrams)});
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
    		<h2 className="section_title">#VictorVictoriaSalon</h2>
		    <div className="instagrams">
		        {instagrams}
		    </div>
		    <span onClick={self.loadMore} className="more_instagrams">Load More</span>
      	</div>
    )
  }
});

var Service = React.createClass({
  getInitialState: function() { 
    return {  };
  },

  render: function() {
    var self = this;
    var title = self.props.title;
    var service_items = self.props.content.map(function(object) {
      return <li className="service_item">
      			<span className="service_title">{object[0]}</span>
      			<span className="service_price">${object[2]}</span>
      			{ object[1].length ? <span className="service_description">({object[1]})</span> : null }
      		</li>
    });
    return (
    	<div className="service">
    		<div className="service-wrap">
    			<div className="service-inner">
					<h2 className="service-title">{title}</h2>
					<ul className="content">
						{service_items}
					</ul>
			    </div>
	      	</div>
      	</div>
    )
  }
});

var ServiceList = React.createClass({
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
    var hair = 	[
    				['Bang or Beard Trim', "", '15+'], 
    				["Children's Haircut", "", '15+'],
    				["Women’s Haircut", "", "37+"],
    				["Men’s Haircut", "", "27+"],
    				["Color", "", "70+"],
    				["Highlight", "", "80+"],
    				["Wash and Style/Blowout", "", "30+"],
    				["Formal Style", "", "45+"],
    				["Updo", "", "65+"],
    				["Deep Conditioner", "", "20+"],
    				["Keratin Complex", "", "100+"],
    				["Brazilian Blowout", "", "200+"]
    			];
    var mass = 	[
					['One Hour Massages', 'Swedish, Aromatherapy, Maternity, Deep Tissue, Couples', '80+'], 
					["90 Minute Massages", "Swedish, Aromatherapy, Maternity, Deep Tissue,Warm Stone, Warm Bamboo, Couples", '120+']
    			];
    var skin = 	[
    				['Eyebrow/Lip/Chin Wax', "", '10+'], 
    				["Underarm/Leg Wax", "", '20+'],
    				["Bikini/Brazilian Wax", "", "35+"],
    				["Classic Manicures", "", "30+"],
    				["Shellac Manicures", "", "40+"],
    				["Classic Pedicures", "", "45+"],
    				["Express Facials", "", "55+"],
    				["Hour Facials", "European, Microdermabrasion, Peels, Vasculyse, etc.", "85+"],
    				["Mineral Makeup", "", "35+"],
    				["Airbrush Makeup", "", "65+"],
    				["FX Makeup", "", "75+"]
				];


    return (
    	<div className="services section container" id="packages">
    	  <h2 className="section_title">Services</h2>
    	  <Service title="Hair" content={hair} />
    	  <Service title="Massage" content={mass} />
    	  <Service title="Skin/Nails" content={skin}/>
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
    var title = self.props.title;
    var formatted_price = '$' + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    var items = self.props.content.map(function(object) {
      return <li>{object}</li>
    });
    return (
    	<div className="package">
    		<div className="package-wrap">
    			<div className="package-inner">
					<h2 className="package-title">{title}</h2>
					<ul className="content">
						{items}
					</ul>
					<p className="price">{formatted_price}</p>
			    </div>
	      	</div>
      	</div>
    )
  }
});

var PackageList = React.createClass({
  getInitialState: function() {
    return {  };
  },

  render: function() {
    var self = this;
    var victor = ['Wash and Style', 'Beard Trim', 'Executive Manicure'],
    	victoria = ['Updo', 'Mineral Makeup', '(Add airbrush for $30)'],
    	victorvictoria = ['Couples Swedish Massage', 'Couples Classic Pedicure', 'Wash and Styles'],
    	treat = ['Hour European Facial', 'Hour Swedish Massage', 'Classic Pedicure', 'Classic Manicure'];


    return (
    	<div className="packages section container" >
    		<div className="package-row" >
				<span className="package_label">
					<h3 className="bridal">Bridal Packages</h3>
				</span>
				<Package title="Victor" image="img/banners/victor.jpg" price="55" content={victor} />
				<Package title="Victoria" image="img/banners/victoria.jpg" price="100" content={victoria} />
	    	</div>
	    	<div className="package-row" >
				<span className="package_label">
					<h3 className="spa">Spa Packages</h3>
				</span>
				<Package title="Victor Victoria" image="img/banners/victorvictoria.jpg" price="305" content={victorvictoria}/>
				<Package title="Treat Yourself" image="img/banners/treat.jpg" price="240" content={treat}/>
			</div>
      	</div>
    )
  }
});


React.render(
  <VV />,
  document.body
);