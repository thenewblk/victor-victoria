var mongoose = require( 'mongoose' );

var staffSchema = mongoose.Schema({
      Email: String,
      MobilePhone: String,
      Address: String,
      City: String,
      State: String,
      Country: String,
      PostalCode: String,
      ID: Number,
      Name: String,
      FirstName: String,
      LastName: String,
      ImageURL: String,
      Bio: String,
      isMale: Boolean,
      hair: Boolean,
      massage: Boolean,
      nails: Boolean,
      skin: Boolean,
      group: Boolean,
      published: Boolean
});

module.exports = mongoose.model('Staff', staffSchema);
