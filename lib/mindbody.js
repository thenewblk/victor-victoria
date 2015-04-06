// mindbody.js
// Replace source_name, password and site_id values in `var params`
// Victor Victoria is 170562

var soap = require('soap'),
    Staff = require('../models/staff');

module.exports = {
    getClasses: function (yourParams) {
        var url = "https://api.mindbodyonline.com/0_5/ClassService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/ClassService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    }
                }
            };

            client.GetClasses(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetClassesResult));
                }
            })
        });
    },

    getServices: function (yourParams) {
        var url = "https://api.mindbodyonline.com/0_5/SaleService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/SaleService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    },
                    "ProgramIDs": {
                        "int": ["3"]
                    },
                    "StaffID": "4"
                   
                }
            };

            client.GetServices(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetServicesResult));
                }
            })
        });
    },

    getStaff: function (yourParams) {
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
                }
            })
        });
    },
    
    getStaffPermissions: function (yourParams) {
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
                    "StaffID": "4"

                }
            };

            client.GetStaffPermissions(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetStaffPermissionsResult));
                }
            })
        });
    },

    getScheduleItems: function (yourParams) {
        var url = "https://api.mindbodyonline.com/0_5/AppointmentService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/AppointmentService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    },
                    "StaffID": {
                            "int": ["4"]
                        },
                    "LocationID": {
                            "int": ["1"]
                        },
                    "StartDate": "2015-01-20",
                    "EndDate": "2015-01-21"
                }
            };

            client.GetScheduleItems(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetScheduleItemsResult));
                }
            })
        });
    },

    getActiveSessionTimes: function (yourParams) {
        var url = "https://api.mindbodyonline.com/0_5/AppointmentService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/AppointmentService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    }
                }
            };

            client.GetActiveSessionTimes(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetActiveSessionTimesResult));
                }
            })
        });
    },
    getBookableItems: function (yourParams) {
        var url = "https://api.mindbodyonline.com/0_5/AppointmentService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/AppointmentService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    },
                    "SessionTypeIDs": {
                        "int": ["5"]
                    },
                    "StartDate": "2015-01-20",
                    "EndDate": "2015-01-21"
                }
            };

            client.GetBookableItems(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetBookableItemsResult));
                }
            })
        });
    },
    getPrograms: function (yourParams) {
        var url = "https://api.mindbodyonline.com/0_5/SiteService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/SiteService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    }
                }
            };

            client.GetPrograms(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetProgramsResult));
                }
            })
        });
    },
    getSessionTypes: function (yourParams) {
        var url = "https://api.mindbodyonline.com/0_5/SiteService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/SiteService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    }
                }
            };

            client.GetSessionTypes(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetSessionTypesResult));
                }
            })
        });
    },
    getLocations: function (yourParams) {
        var url = "https://api.mindbodyonline.com/0_5/SiteService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/SiteService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    }
                }
            };

            client.GetLocations(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetLocationsResult));
                }
            })
        });
    },
    getActivationCode: function (yourParams) {
        var url = "https://api.mindbodyonline.com/0_5/SiteService.asmx?wsdl";
        soap.createClient(url, function (err, client) {
            if (err) {
                throw err;
            }

            client.setEndpoint('https://api.mindbodyonline.com/0_5/SiteService.asmx');
            var params = {
                "Request": {
                    "SourceCredentials": {
                        "SourceName": "TheNewBLK",
                        "Password": "QhAMEtPAMb9eNSvEKbWibo5wm70=",
                        "SiteIDs": {
                            "int": ["170562"]
                        }
                    }
                }
            };

            client.GetActivationCode(params, function (errs, result) {
                if (errs) {
                    console.log(errs);
                } else {
                    console.log(JSON.stringify(result.GetActivationCodeResult));
                }
            })
        });
    }


    
}

// Your application file.js

//var mindbody = require('./mindbody.js');
//mindbody.getClasses();
