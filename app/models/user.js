// grab the package that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//User Schema
var UserSchema = new Schema({
	name: String,
	username: {type: String, required: true, index: {unique: true}},
	password: {type: String, required: true, selected: false}
});

// Hash the password before save
UserSchema.pre('save', function(next) {
	var user = this;
	// hash password only if it has been changed or user is new
	if (!user.isModified('password')) return next();
	//generate the Hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err) return next(err);
		//change the password to the hashed version
		user.password = hash;
		next();
	});
});

// Method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
}
//Return the model

module.exports = mongoose.model('user', UserSchema);
