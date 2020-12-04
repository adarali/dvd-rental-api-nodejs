const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, minlength: 3},
    description: {type: String, required: true, trim: true},
    rentalPrice: Number,
    salePrice: Number,
    stock: Number,
    available: {type: Boolean, default: true},
    movieImages: Array,
    likeCount: {type: Number, default: 0},
});

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
        callback).sort({[sort]: desc? -1 : 1});
}

exports.findOne = function(id, callback) {
    Movie.findById(id, callback);
}

exports.save = function(movieParam, callback) {
    const movie = new Movie(movieParam);
    return movie.save(callback)
}

exports.update = function(id, movieParam, callback) {
    Movie.findByIdAndUpdate(id, movieParam, {new: true, runValidators: true}, callback);
}

exports.delete = function(id, callback) {
    Movie.findByIdAndDelete(id, callback);
}

//loadMovies()

function loadMovies() {
    let rawData = fs.readFileSync('movies200.json');
    let movies = JSON.parse(rawData).movies;
    console.log(movies);
    movies.forEach(m => {
        if(m.title != 'null') {
            exports.save(m, () =>{});
        }
    })
}
