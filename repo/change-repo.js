const mongoose = require('mongoose');
const movieRepo = require('./movie-repo');
const { changeSchema } = require('../schemas/change-schema');

const Change = mongoose.model('Change', changeSchema);

exports.Change = Change;

exports.getChangeLogs = function(params, callback) {
    Change.find({changeDateTime: {$gte : params.dateFrom, $lte : params.dateTo}}, callback);
}

exports.logChanges = function(movieId, movie, callback) {
    movieRepo.findOne(movie.hasOwnProperty('title') && movieId, (err, dbMovie) => {
        if(err) return callback(err);
        let changes = [];
        if(dbMovie.title !== movie.title) {
            changes.push({
                movie: movie,
                oldValue: dbMovie.title,
                newValue: movie.title,
                changeDateTime: new Date(),
                changeType: "TITLE",
            });
        }

        if(movie.hasOwnProperty('rentalPrice') && dbMovie.rentalPrice !== movie.rentalPrice) {
            changes.push({
                movie: movie,
                oldValue: dbMovie.rentalPrice,
                newValue: movie.rentalPrice,
                changeDateTime: new Date(),
                changeType: "RENTAL_PRICE",
            });
        }

        if(movie.hasOwnProperty('salePrice') && dbMovie.salePrice !== movie.salePrice) {
            changes.push({
                movie: movie,
                oldValue: dbMovie.salePrice,
                newValue: movie.salePrice,
                changeDateTime: new Date(),
                changeType: "SALE_PRICE",
            });
        }
        callback(err, changes.map(ch => new Change(ch)))
    });
}

