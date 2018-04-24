const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');
const LocalStrategy = require('passport-local').Strategy;
module.exports = (app)=>{

    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.get('auth.secret');
  /*  opts.issuer = config.get('auth.issuer');
    opts.audience = config.get('auth.audience');*/
    app.use(passport.initialize());
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        app.mongo.User.findOne({id: jwt_payload.sub}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
    passport.use(new LocalStrategy(app.mongo.User.authenticate()));
    passport.serializeUser(app.mongo.User.serializeUser());
    passport.deserializeUser(app.mongo.User.deserializeUser());

    /*app.get('/register', function(req, res) {
        res.render('register', { });
    });*/

    app.post('/register', function(req, res, next) {
        app.mongo.User.register(new app.mongo.User({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
                return next(err);
            }

            passport.authenticate('local')(req, res, function () {
                return res.json({
                    jwt: req.user.getJWT(),
                    user:req.user.toObject()
                })
            });
        });
    });

   /* app.get('/login', function(req, res) {
        res.render('login', { user : req.user });
    })*/

    app.post('/login', function(req, res, next) {
        return passport.authenticate('local', {session:false}, function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                return res.json(info);
            }
            return req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.json({
                    jwt: req.user.getJWT(),
                    user:req.user.toObject()
                })
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

}