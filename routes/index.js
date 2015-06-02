var util = require("util");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send(false);
}

module.exports = function(app, passport) {
	// locally --------------------------------
	// LOGIN ===============================
	// show the login form
	app.get('/login', function(req, res) {
		res.render('login.ejs', {
			title: ' - Log In',
		});
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// process the login form
	app.post('/login-js', function(req, res, next) {
	  passport.authenticate('local-login', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.send(info); }
	    if (info) { return res.send(info); }
	    if (!info) {
		    req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      return res.send(user);
		    });
		}
	  })(req, res, next);
	});

	// SIGNUP =================================
	// show the signup form
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {
			title: ' - Sign Up',
		});
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/signup-js', function(req, res, next) {
	  passport.authenticate('local-signup', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.send('fuck you'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.send(user);
	    });
	  })(req, res, next);
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/api/me', function(req, res) {
		res.send(req.user);
	});

	app.get('/', function(req, res) {
		if (req.user) {
		  res.render('index-admin', {
		  	user: req.user
		  });
		} else {
		  res.render('index-show');
		}
	});

	app.get('/gifts', function(req, res) {
		res.render('gifts.ejs');
	});

	app.get('*', function(req, res) {
	 	if (req.user) {
		  res.render('index-admin', {
		  	user: req.user
		  });
		} else {
		  res.render('index-show');
		}
	});
};
