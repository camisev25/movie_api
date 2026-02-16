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

app.get('/films', (req, res) => {
    res.json(top10Films);
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