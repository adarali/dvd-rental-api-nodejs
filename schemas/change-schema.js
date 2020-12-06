const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const changeSchema = new Schema({
    movie: {type: Schema.Types.ObjectId, ref: 'Movie'},
    oldValue: {type: String, required: true},
    newValue: {type: String, required: true},
    changeDateTime: {type: Date, required: true, default: new Date()},
    changeType: {type: String, required: true}
});




module.exports = {changeSchema}