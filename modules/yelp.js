'use strict';

const superagent = require('superagent');

const YELP_API_KEY = process.env.YELP_API_KEY;

function getYelp(req, res){
  superagent.get(`https://api.yelp.com/v3/businesses/search?latitude=${req.query.data.latitude}&longitude=${req.query.data.longitude}`).set('Authorization', `Bearer ${YELP_API_KEY}`).then(response => {
    // console.log('response.text', JSON.parse(response.text).businesses);
    const allBusinesses = JSON.parse(response.text).businesses;
  
   const allData = allBusinesses.map(event => {
     return {
       'url': event.url,
       'name': event.name,
       'rating': event.rating,
       'price': event.price,
       'image_url': event.image_url
     };
   })
  //  console.log('allData', allData)
   res.send(allData);
  });
}

module.exports = getYelp;