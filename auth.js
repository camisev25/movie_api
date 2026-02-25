const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport');

let generateJWTToken = (user) => {
  return jwt.sign(
    {
      Username: user.Username,
      _id: user._id
    },
    'your_jwt_secret',
    { expiresIn: '7d' }
  );
};

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Login failed',
          user: user
        });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.send(error);
        }

        const token = generateJWTToken(user);
        return res.json({ user, token });
      });
    })(req, res);
  });
};
