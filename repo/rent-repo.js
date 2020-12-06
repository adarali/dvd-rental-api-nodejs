const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { rentSchema } = require('../schemas/rent-schema');
const movieRepo = require('./movie-repo');
const userRepo = require('./user-repo');
require('../utils/utils');

const Rent = mongoose.model('Rent', rentSchema);

exports.doRent = function(movieId, params, username, callback) {
    const movie = movieRepo.findOne(movieId, (err, movie) => {
        if(err) return callback(err, null);
        if(!movie.available) return callback({message: "Movie not available"}, null)
        userRepo.findByUsername(username, (err, user) => {
            if(err) return callback(err, null);
            Rent.findOne({user: user, movie: movie}, (err, dbRent) => {
                if(err) return callback({message: err.message});
                if(dbRent && !dbRent.actualReturnDate) return callback({message: "You've not returned this movie"}, null)
                let rent = new Rent({
                    movie: movie,
                    user: user,
                    quantity: params.quantity,
                    expectedReturnDate: new Date().addDays(params.rentDays),
                }).populate('movie')
                try {
                    rent.movie.subtractStock(rent.quantity);
                    rent.movie.save();
                    rent.save(callback);
                } catch (err) {
                    callback({message: err}, null);
                }
            });
        });
    });
}

exports.getRentLogs = function(params, callback) {
    Rent.find({rentDate: {$gte : params.dateFrom, $lte : params.dateTo}}, callback)
        .populate('movie')
}

exports.returnRent = function(id, callback) {
    Rent.findById(id, (err, rent) => {
        if(err) return callback(err, null)
        if(!rent.actualReturnDate) {
            rent.actualReturnDate = new Date();
            rent.movie.addStock(rent.quantity);
            rent.movie.save();
        } else {
            return callback({message: "The movie is already returned"}, null);
        }
        rent.save();
        callback(err, rent);
    }).populate('movie');
}