var Staff = require('../models/staff');

module.exports = function(app, passport) {
	// Add New staff
	app.post('/api/staff/new', function(req, res) {
		var new_staff = {};

		// new_staff.Email = req.body.Email,
		// new_staff.MobilePhone = req.body.MobilePhone,
		// new_staff.Address = req.body.Address,
		// new_staff.City = req.body.City,
		// new_staff.State = req.body.State,
		// new_staff.Country = req.body.Country,
		// new_staff.PostalCode = req.body.PostalCode,
		// new_staff.ID  = req.body.ID,
		// new_staff.Name = req.body.name,
		// new_staff.FirstName = req.body.FirstName,
		// new_staff.LastName = req.body.LastName,
		// new_staff.ImageURL = req.body.ImageURL,
		// new_staff.Bio = req.body.Bio,
		// new_staff.isMale = req.body.isMale,
		
		new_staff.hair = req.body.hair,
		new_staff.massage = req.body.massage,
		new_staff.nails = req.body.nails,
		new_staff.skin = req.body.skin,
		new_staff.group = req.body.group,
		new_staff.published = req.body.published;

		Staff.create(new_staff, function (err, staff) {
		  if (err) return console.log(err);
		  res.send(staff);
		});
	});

	// Display staff
	app.get('/api/staff/', function(req, res) {
		if (req.isAuthenticated()) {
			Staff
				.find({})
				.exec( function (err, staff) {
				  	if (err) return console.log(err);
					res.send(staff);
			});
		} else {
			Staff
				.find({})
				.where({ published: true })
				.exec( function (err, staff) {
				  	if (err) return console.log(err);
					res.send(staff);
			});
		}
	});

	// Display staff
	app.get('/api/staff/:id', function(req, res) {
		Staff
			.findOne({ ID: req.params.id })
			.exec( function (err, staff) {
			  	if (err) return console.log(err);
				res.send(staff);
		});
	});

	// Display Edit staff Form
	app.get('/api/staff/:id/edit', isLoggedIn, function(req, res) {
		Staff
			.findOne({ ID: req.params.id })
			.exec( function (err, staff) {
			  if (err) { console.log(err); }
				res.send(staff);
		});
	});

	// Edit staff
	app.post('/api/staff/:id/edit', isLoggedIn, function(req, res) {
		var edit_staff = {};

		// edit_staff.Email = req.body.Email,
		// edit_staff.MobilePhone = req.body.MobilePhone,
		// edit_staff.Address = req.body.Address,
		// edit_staff.City = req.body.City,
		// edit_staff.State = req.body.State,
		// edit_staff.Country = req.body.Country,
		// edit_staff.PostalCode = req.body.PostalCode,
		// edit_staff.ID  = req.body.ID,
		// edit_staff.Name = req.body.name,
		// edit_staff.FirstName = req.body.FirstName,
		// edit_staff.LastName = req.body.LastName,
		// edit_staff.ImageURL = req.body.ImageURL,
		// edit_staff.Bio = req.body.Bio,
		// edit_staff.isMale = req.body.isMale,

		edit_staff.hair = req.body.hair,
		edit_staff.massage = req.body.massage,
		edit_staff.nails = req.body.nails,
		edit_staff.skin = req.body.skin,
		edit_staff.group = req.body.group,
		edit_staff.published = req.body.published;

		Staff
			.findOne({ id: req.params.id })
			.exec(function (err, staff) {
			  if (err) return console.log(err);

				// staff.Email = edit_staff.Email,
				// staff.MobilePhone = edit_staff.MobilePhone,
				// staff.Address = edit_staff.Address,
				// staff.City = edit_staff.City,
				// staff.State = edit_staff.State,
				// staff.Country = edit_staff.Country,
				// staff.PostalCode = edit_staff.PostalCode,
				// staff.ID  = edit_staff.ID,
				// staff.Name = edit_staff.name,
				// staff.FirstName = edit_staff.FirstName,
				// staff.LastName = edit_staff.LastName,
				// staff.ImageURL = edit_staff.ImageURL,
				// staff.Bio = edit_staff.Bio,
				// staff.isMale = edit_staff.isMale,
				staff.hair = edit_staff.hair,
				staff.massage = edit_staff.massage,
				staff.nails = edit_staff.nails,
				staff.skin = edit_staff.skin,
				staff.group = edit_staff.group,
				staff.published = edit_staff.published;

				staff.save(function (err) {
					console.log("hair: " + JSON.stringify(staff.hair));

					if (err) return console.log(err);
					res.send(staff);
				});
			});
	});

	
	// Delete staff
	app.delete('/api/staff/:id/delete', isLoggedIn, function(req, res) {
		Staff
			.findOne({ ID: req.params.id })
			.remove( function (err, staff) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send(false);
}