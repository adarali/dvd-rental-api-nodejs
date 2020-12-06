var express = require('express');
var app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://172.17.0.2/testdb',
{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('runValidators', true)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log("Connection succeeded!!!");
});

require('./security/security').addMiddleware(app);

app.use(express.json());

app.use('/api/v1/movies', require('./routes/movie-routes'));
app.use('/api/v1/users', require('./routes/user-routes'));
app.use('/api/v1', require('./routes/log-routes'));
app.use('/login/auth', require('./routes/login-routes'));

let port = process.env.PORT || 8080
app.listen(port, () => console.log(`Listening to port ${port}`));
