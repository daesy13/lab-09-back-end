'use strict';

const superagent = require('superagent');

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

function getMovies(req, res){
  superagent.get(`https://api.themoviedb.org/3/search/movie/?api_key=${MOVIE_API_KEY}&language=en-US&page=1&query=${req.query.data.search_query}`).then(response => {
   // console.log('response', response);
   const allMovies = JSON.parse(response.text);
   // console.log('allMovies', allMovies)

   const allData = allMovies.results.map(event => {
     return {
       'title': event.original_title,
       'released_on': event.release_date,
       'total_votes': event.vote_count,
       'average_votes': event.vote_average,
       'popularity': event.popularity,
       'image_url': `https://image.tmdb.org/t/p/w500${event.poster_path}`,
       'overview': event.overview
     };
   })
   // console.log('allData', allData)
   res.send(allData);
 })
}

module.exports = getMovies;