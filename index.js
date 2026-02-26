const express = require('express');
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

const passport = require('passport');
require('./passport');

let auth = require('./auth')(app);

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');

mongoose.connect('mongodb://127.0.0.1:27017/films');

//Returns all films//
app.get('/movies', passport.authenticate('jwt', { session: false}), async (req, res) => {
    try { 
        const movies = await Movies.find(); 
        res.json(movies); 
    } catch (err) { 
        console.error(err); 
        res.status(500).send('Error: ' + err); 
    }
});

//Returns a single film by title.//
app.get('/movies/:title', passport.authenticate('jwt', { session: false}), async (req, res) => {
    try { 
        const movie = await Movies.findOne({ Title: req.params.title }); 
        if (!movie) return res.status(404).send('Movie not found'); 
        res.json(movie); 
    } catch (err) { 
        console.error(err); res.status(500).send('Error: ' + err); 
    }
});

//Returns genre info by name.//
app.get('/genres/:name', passport.authenticate('jwt', { session: false}), async (req, res) => {
  try {
    const movie = await Movies.findOne({ 'Genre.Name': req.params.name });
    if (!movie) return res.status(404).send('Genre not found');
    res.json(movie.Genre);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Returns director info by name.//
app.get('/directors/:name', passport.authenticate('jwt', { session: false}), async (req, res) => {
  try {
    const movie = await Movies.findOne({ 'Director.Name': req.params.name });
    if (!movie) return res.status(404).send('Director not found');
    res.json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Registers new user.//
app.post(
  '/users',
  [
    check('Username', 'Username is required').notEmpty(),
    check('Username', 'Username must be at least 5 characters').isLength({ min: 5 }),
    check('Password', 'Password is required').notEmpty(),
    check('Email', 'Email is invalid').isEmail()
  ],
  async (req, res) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const existingUser = await Users.findOne({ Username: req.body.Username });
      if (existingUser) {
        return res.status(400).send(req.body.Username + ' already exists');
      }

      let hashedPassword = Users.hashPassword(req.body.Password);

      const newUser = await Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      });

      return res.status(201).json(newUser);

    } catch (err) {
      console.error(err);
      return res.status(500).send('Error: ' + err);
    }
  }
);


//Update user info//
app.put('/users/:username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true } // return updated document
    );

    if (!updatedUser) return res.status(404).send('User not found');
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Adds a film to the user's list of favorites; returns a confirmation message.//
app.post('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false}), async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.username },
      { $addToSet: { FavoriteMovies: req.params.movieId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json({
      message: `Movie ${req.params.movieId} was added to ${req.params.username}'s favorites.`,
      user: updatedUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Removes a film from the user's list of favorites; returns a confirmation message.//
app.delete('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false}), async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.username },
      { $pull: { FavoriteMovies: req.params.movieId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json({
      message: `Movie ${req.params.movieId} was removed from ${req.params.username}'s favorites.`,
      user: updatedUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Deregisters an existing user; returns a confirmation message that the user has been removed.//
app.delete('/users/:username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  try {
    const deletedUser = await Users.findOneAndDelete({ Username: req.params.username });
    if (!deletedUser) return res.status(404).send('User not found');
    res.send(req.params.username + ' was deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

app.get('/', (req,res) => {
    res.send('Welcome to my movies selection!');
});

app.use( (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});