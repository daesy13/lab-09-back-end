'use strict';
//make this avilable to other files

const pg = require('pg');
const superagent = require('superagent');

const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;

const client = new pg.Client(process.env.DATABASE_URL);
//check for errors on postgress
client.on('error', error => console.error(error)); 
client.connect();

// constructor
function Location(searchQuery, coordinates){
  this.search_query = searchQuery;
  this.formatted_query = coordinates.formatted_address;
  this.latitude = coordinates.geometry.location.lat;
  this.longitude = coordinates.geometry.location.lng;
}

function getLocation(req, res){
  // console.log('req.query', req.query) // { data: 'lynnwood' }
  const whatTheUserSearchedFor = req.query.data;
  const selectSQL = 'SELECT * FROM locations WHERE search_query = $1';

  client.query(selectSQL, [whatTheUserSearchedFor]).then(sqlResponse => {
    console.log('sqlResponse.rowCount', sqlResponse.rowCount);
    console.log('sqlResponse.rows', sqlResponse.rows);
    if(sqlResponse.rowCount > 0){
      res.send(sqlResponse.rows[0]);
    } else {
      superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${whatTheUserSearchedFor}&key=${GEOCODING_API_KEY}`).then(response => { 
    // console.log('response.body', response); // Gives the Object data of the info requested
        const newLocation = new Location(whatTheUserSearchedFor, response.body.results[0]);
        const sqlValues = [newLocation.search_query, newLocation.formatted_query, newLocation.latitude, newLocation.longitude];
        // CALL SQL
        const sqlNewQuery = `INSERT INTO locations(search_query, formatted_query, latitude, longitude)VALUES($1, $2, $3, $4)`;
    
        client.query(sqlNewQuery, sqlValues);
        res.send(newLocation);
      });
    }
  });
}

module.exports = getLocation;