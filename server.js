'use strict';

//dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
app.use(cors());

//callbacks
const getLocation = require('./modules/location');
const getWeather = require('./modules/weather');
const getEvents = require('./modules/events');
const getMovies = require('./modules/movies');
const getYelp = require('./modules/yelp');


// ROUTES
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/events', getEvents);
app.get('/movies', getMovies);
app.get('/yelp', getYelp);

app.listen(PORT, () => console.log(`up on port ${PORT}`));