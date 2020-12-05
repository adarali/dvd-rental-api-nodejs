const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true, minlength: 3},
    password: {type: String, required: true, trim: false, select: false},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: false, trim: true},
    admin: {type: Boolean, required: true, default: false},
    picture: {type: String, required: false, default: null}
});

userSchema.virtual('fullName').get(function() {
    return [this.firstName, this.lastName].join(" ");
});

const User = mongoose.model('User', userSchema);

exports.findAll = function(callback) {
    User.find(callback);
}

exports.findByUsername = function(username, callback) {
    User.findOne({username: username}).exec(callback);
}

exports.getPasswordHash = function(username, callback) {
    User.findOne({username: username}).select("+password").exec(callback);
}

exports.save = function(userParam, callback) {
    bcrypt.hash(userParam.password, 10, (err, hash)=> {
        if(err) return callback(err, userParam)
        const user = new User(userParam);
        user.password = hash;
        user.save(callback);
    });
}

exports.update = function(id, userParam, callback) {
    bcrypt.hash(userParam.password, 10, (err, hash) => {
            if(userParam.password && err) return callback(err, userParam);
            else if (userParam.password) userParam.password = hash;
            User.findByIdAndUpdate(id, userParam, {new: true}, callback);
    });
}