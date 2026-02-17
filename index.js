const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('combined'));
app.use(express.static('public'));

let top10Films = [
    {
        title: 'Moulin Rouge',
        director: 'Baz Luhrmann'
    },
    {
        title: 'Lalaland',
        director: 'Damien Chazelle'
    },
    {
        title: 'Mary Poppins',
        director: 'Robert Stevenson'
    }
];

//Returns all films//
app.get('/films', (req, res) => {
    res.send('This will return a list of all movies');
});

//Returns a single film by title.//
app.get('/films/:title', (req, res) => {
    res.send('This will return data about a single movie by title');
});

//Returns genre info.//
app.get('/genres/:title', (req, res) => {
    res.send('This will return data about a genre by name');
});

//Returns director info.//
app.get('/directors/:name', (req, res) => {
    res.send('This will return data about a director by name');
});

//Registers new user.//
app.post('/users', (req, res) => {
    res.send('This will register a new user');
});

//Update user info//
app.put('/users/:username', (req, res) => {
    res.send('This will update user information');
});

//Adds a film to the user's list of favorites; returns a confirmation message.//
app.post('/users/:username/films/:filmId', (req,res) => {
    res.send('This will add a movie to the user’s list of favorites');
});

//Removes a film from the user's list of favorites; returns a confirmation message.//
app.delete('/users/:username/films/:filmId', (req, res) => {
    res.send('This will remove a movie from the user’s list of favorites');
});

//Deregisters an existing user; returns a confirmation message that the user has been removed.//
app.delete('/users/:username', (req, res) => {
    res.send('This will delete a user');
});

app.get('/', (req,res) => {
    res.send('Welcome to my musical films selection!');
});

app.use( (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('My app is listening on port 8080.'); 
});