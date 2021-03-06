const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { dateDiffInDays } = require('../utils/utils');

const rentSchema = new mongoose.Schema({
    movie: {type: Schema.Types.ObjectId, ref: 'Movie'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    rentDate: {type: Date, required: true, default: Date.now()},
    expectedReturnDate: {type: Date, required: true, default: Date.now()},
    actualReturnDate: {type: Date, required: false, default: null},
    quantity: {type: Number, required: true, default: 1},
});

rentSchema.virtual('price').get(function() {
    return this.quantity * this.movie.rentalPrice * this.daysRented
});

rentSchema.virtual('daysRented').get(function(){
    let retDate = this.actualReturnDate || new Date();
    return dateDiffInDays(this.rentDate, retDate);
});

rentSchema.virtual('delay').get(function(){
    let returnDate = this.actualReturnDate || new Date();
    if(returnDate < this.expectedReturnDate) return 0;
    return dateDiffInDays(this.expectedReturnDate, returnDate);
});

rentSchema.virtual('penalty').get(function(){
    return this.delay * this.movie.rentalPrice * this.quantity;
});

rentSchema.virtual('totalPrice').get(function() {
    return this.price + this.penalty;
});

rentSchema.set('toJSON', {virtuals: true})

module.exports = {rentSchema}