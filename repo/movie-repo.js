const mongoose = require('mongoose');
const { param } = require('../routes/log-routes');
const changeRepo = require('./change-repo');

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, minlength: 3},
    description: {type: String, required: true, trim: true},
    rentalPrice: {type: Number, required: true, min: 0.01, default: 10},
    salePrice: {type: Number, required: true, min: 0.01, default: 50},
    stock: {type: Number, required: true, min: 0, default: 100},
    available: {type: Boolean, default: true},
    movieImages: Array,
    likeCount: {type: Number, default: 0},
    likeUsers: {type: Array, default: [], select: false}
});

movieSchema.virtual('thumbnail').get(function() {
    return this.movieImages[0].url;
})

movieSchema.virtual('likes').get(function() {
    return this.likeCount;
})

movieSchema.virtual('id').get(function() {
    return this._id;
});

movieSchema.virtual('likes').get(function() {
    return this.likeCount;
});

movieSchema.set('toJSON', {virtuals: true})

movieSchema.methods.subtractStock = function(quantity) {
    console.log("subtract stock", quantity)
    if(quantity > this.stock) throw {message: "Not enough stock"};
    this.stock -= quantity;
}

movieSchema.methods.addStock = function(quantity) {
    console.log("add stock", quantity)
    this.stock += quantity;
}

const Movie = mongoose.model('Movie', movieSchema);

exports.findAll = function(params, callback) {
    let title = params.title;
    let page = params.page || 0;
    let pageSize = parseInt(params.per_page) || 10;
    let sort = params.sort || 'title';
    let desc = sort.indexOf('-') == 0;
    if(desc && sort.length > 1) sort = sort.substring(1)
    let available = parseInt(params.available);
    let filter = {title: {$regex: new RegExp(title, 'i')}}
    if((available || available == 0) && available < 2) filter.available = available == 1;
    let fields = params.fields ? params.fields.split(",").join(" ") : null;

    Movie.find(filter, fields, 
        {skip: page*pageSize, limit: pageSize}, 
        (err, movies) => {
            if(err) return callback(err, null)
            Movie.count(filter, (err, count) => callback(err, {movies: movies, count: count}))
        }).sort({[sort]: desc? -1 : 1});
}

exports.findOne = function(id, callback) {
    Movie.findById(id, callback);
}

exports.save = function(movieParam, callback) {
    const movie = new Movie(movieParam);
    Movie.count({title: movieParam.title}, (err, result) => {
        if(err) return callback(err, null);
        if(result > 0) return callback({message: "There is already a movie with the same title"}, null);
        return movie.save(callback)
    });
    
}

exports.update = function(id, movieParam, callback) {
    changeRepo.logChanges(id, movieParam, (err, changes) => {
        if(err) return callback(err, null);
        Movie.findByIdAndUpdate(id, movieParam, {new: true, runValidators: true}, (err, updated)=> {
            if(err) return callback(err, null);
            changes.forEach(change => {
                change.movie = updated;
                change.save();
            })
            callback(err, updated);
        });

    })
    
}

exports.delete = function(id, callback) {
    Movie.findByIdAndDelete(id, callback);
}

exports.toggleAvailable = function(id, callback) {
    Movie.findById(id, (err, movie) => {
        movie.available = !movie.available;
        movie.save();
        callback(err, movie);
    });
}

exports.likeMovie = function(id, username, callback) {
    Movie.findById(id, "+likeUsers", (err, movie) => {
        let index = movie.likeUsers.indexOf(username);
        if(index >= 0) {
            movie.likeUsers.splice(index, 1);
        } else {
            movie.likeUsers.push(username);
        }
        movie.likeCount = movie.likeUsers.length;
        movie.save();
        callback(err, {liked: index < 0, likes: movie.likeCount});
    });
}



const loadMovies = function() {
    const fs = require('fs');
    let rawData = fs.readFileSync('movies200.json');
    let movies = JSON.parse(rawData).movies;
    console.log(movies);
    movies.forEach(m => {
        m.movieImages = m.movieImages.reverse();
        if(m.title != 'null') {
            console.log("adding movie", m.title)
            exports.save(m, () =>{});
        }
    })
}