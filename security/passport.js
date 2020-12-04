const passport = require('passport');
const userRepo = require('../repo/user-repo');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    console.log("this is passport!")
    userRepo.findByUsername(jwtPayload.sub, (err, user) => {
        if(err) return done(err);
        if(user) return done(null, user);
        return done(null, false);
    });
}));