const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const movieRepo = require('./movie-repo');
const userRepo = require('./user-repo');

const purchaseSchema = new Schema({
    movie: {type: Schema.Types.ObjectId, ref: 'Movie'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    purchaseDateTime: {type: Date, required: true, default: new Date()},
    quantity: {type: Date, required: true, default: 1},
});

purchaseSchema.methods.purchase = function() {
    this.movie.subtractStock(this.quantity);
}

const Purchase = mongoose.model('Purchase', purchaseSchema);

exports.getPurchaseLogs = function(params, callback) {
    Purchase.find({purchaseDateTime: {$gte : params.dateFrom, $lte : params.dateTo}}, callback)
        .populate('movie')
}

exports.purchase = function(movieId, params, username, callback) {
    movieRepo.findOne(movieId, (err, movie) => {
        if(err) return callback({message: err.message}, null);
        userRepo.findByUsername(username, (err, user)=> {
            if(err) return callback({message: err.message}, null);
            const purchase = Purchase({
                movie: movie,
                user: user,
                quantity: params.quantity,
            });
            try {
                purchase.purchase();
                purchase.save();
                purchase.movie.save();
                return callback(null, purchase);
            } catch (err) {
                return callback({message: err.message}, null);
            }
        });
    });
}