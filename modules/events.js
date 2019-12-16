'use strict';

const superagent = require('superagent');

const EVENTFUL_API_KEY = process.env.EVENTFUL_API_KEY;

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

module.exports = getEvents;