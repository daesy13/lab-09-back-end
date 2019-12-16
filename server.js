'use strict';

//dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const app = express();


require('dotenv').config();

app.use(cors());


// global variables
const PORT = process.env.PORT;
const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
const EVENTFUL_API_KEY = process.env.EVENTFUL_API_KEY;

//callbacks
const getLocation = require('./modules/location')

// ROUTES
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/events', getEvents);

// CONSTRUCTOR *** I haven't use constructors 


function Weather(location){
  this.time = new Date(location.time).toDateString();
  this.forecast = location.summary;
}

// Routes functions handlers



function getWeather(req, res){
  const weatherLatitude = req.query.data.latitude;
  const weatherLongitude = req.query.data.longitude
  // console.log('req.query', req.query); // Gives the info for ex. Lynnwood, description, lat and lng

  superagent.get(`https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${weatherLatitude},${weatherLongitude}`).then(response => {
    // console.log('response.body.daily.data', response.body.daily.data) // Gives me the object or array data requested 
    
    const allWeather = response.body.daily.data; 
    
    let allData = allWeather.map(event => {
      return {
        'time': new Date(event.time * 1000).toDateString(),
        'forecast': event.summary
      }
    });
    // console.log('allData', allData);
    res.send(allData);
  });
}

function getEvents(req, res){
  // console.log('req.query.data.formatted_query', req.query.data.formatted_query)
  superagent.get(`http://api.eventful.com/json/events/search?app_key=${EVENTFUL_API_KEY}&keyword=coders&location=${req.query.data.formatted_query}&date=Future`).then(response => {
    // console.log(JSON.parse(response.text).events.event[0]);
    // const firstEvent = JSON.parse(response.text).events.event[0];
    const allEvents = JSON.parse(response.text).events.event;

    const allData = allEvents.map(event => {
      return {
        'link': event.url,
        'name': event.title,
        'event_date': new Date(event.start_time).toLocaleDateString(),
        'summary': event.description
      };
    });
    // console.log(allData);

    res.send(allData);

  });
}

app.listen(PORT, () => console.log(`up on port ${PORT}`));
