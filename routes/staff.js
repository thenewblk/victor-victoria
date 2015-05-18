var soap = require('soap'),
	Staff = require('../models/staff');

module.exports = function(app, passport) {
	// Add New staff
	app.post('/api/staff/new', function(req, res) {
		var new_staff = {};
		new_staff.hair = req.body.hair,
		new_staff.massage = req.body.massage,
		new_staff.nails = req.body.nails,
		new_staff.skin = req.body.skin,
		new_staff.group = req.body.group,
		new_staff.published = req.body.published;
		new_staff.bio = req.body.bio;

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
		edit_staff.hair = req.body.hair,
		edit_staff.massage = req.body.massage,
		edit_staff.nails = req.body.nails,
		edit_staff.skin = req.body.skin,
		edit_staff.group = req.body.group,
		edit_staff.published = req.body.published;
		edit_staff.bio = req.body.bio;

		Staff
			.findOne({ id: req.params.id })
			.exec(function (err, staff) {
			  if (err) return console.log(err);
				staff.hair = edit_staff.hair,
				staff.massage = edit_staff.massage,
				staff.nails = edit_staff.nails,
				staff.skin = edit_staff.skin,
				staff.group = edit_staff.group,
				staff.published = edit_staff.published;
				staff.Bio = edit_staff.bio;

				staff.save(function (err) {
					console.log("staff: " + JSON.stringify(staff));

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

	app.post('/api/getstaff', isLoggedIn, function(req, res) {
        var url = "https://api.mindbodyonline.com/0_5/StaffService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/StaffService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    },
                    "LocationID": "1"

                }
            };

            client.GetStaff(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                    res.send(false)
                } else {
                    var staffList = result.GetStaffResult.StaffMembers.Staff;
                    console.log(JSON.stringify(staffList));
                    staffList.forEach(function(staff) {
                      Staff.findOneAndUpdate({id: staff.ID}, staff, {upsert: true}, function( err , staff_member ){
                        if ( err ){ 
                          console.log('  grabTags err: '+err);
                        }
                        if (staff_member){ }
                      });
                    });
                    res.send(true)
                }
            })
        });
	});
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send(false);
}