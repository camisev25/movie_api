const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const Models = require('./models.js');
const Users = Models.User;
const bcrypt = require('bcrypt');

// LOCAL STRATEGY (username + password)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password'
    },
    async (username, password, callback) => {
      try {
        const user = await Users.findOne({ Username: username });

        if (!user) {
          return callback(null, false, { message: 'Incorrect username.' });
        }

        if (!user.validatePassword(password)) {
          return callback(null, false, { message: 'Incorrect password.' });
        }

        return callback(null, user);
      } catch (error) {
        return callback(error);
      }
    }
  )
);

// JWT STRATEGY (token verification)
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret'
    },
    async (jwtPayload, callback) => {
      try {
        return callback(null, jwtPayload);
      } catch (error) {
        return callback(error);
      }
    }
  )
);
