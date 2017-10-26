var request = require('request');
var rp = require('request-promise'); 
var _ = require('lodash');

var client_id = '13ff1a4fe1a743269c9153a2c3af1dea'; 
var client_secret = 'fbf7f9a8b97a4f299db06d298e352e85'; 

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

// Error Handler
let errorHandle = function(error){
	try{throw new Error(error)}catch(e){console.log(e)}
}

// Auth
let auth = rp.post(authOptions)
	.then(resp=>{
		return {
			access_token:resp.access_token
		}
	})
	.catch(errorHandle)


// get Genres
let getGenres = function(artistId){
	return function(body){
		var token = body.access_token;
		var options = {
		  url: `https://api.spotify.com/v1/artists/${artistId}`,
		  headers: {
		    'Authorization': 'Bearer ' + token
		  },
		  json: true
		};
		return rp(options).then(e=>{
			console.log(e.genres)
			return {
				access_token:body.access_token, 
				genres:	e.genres			
			}
		}).catch(errorHandle)
	}
}	


let example = function(body){
	var token = body.access_token;
	var options = {
	  url: 'https://api.spotify.com/v1/search?q=tania%20bowra&type=artist&limit=50',
	  headers: {
	    'Authorization': 'Bearer ' + token
	  },
	  json: true
	};
	return rp(options).then(e=>console.log(e)).catch(errorHandle)
}


let findSimilar = function(body){
	
		var token = body.access_token;
		var options = {
		  url: 'https://api.spotify.com/v1/artists/4tZwfgrHOc3mvqYlEYSvVi/related-artists',
		  headers: {
		    'Authorization': 'Bearer ' + token
		  },
		  json: true
		};

		function similarTags(genresToFind, currentGenres){
			let result = false
			genresToFind.forEach(e=>{
				if(currentGenres.includes(e)){
					result = true
				}
			})
			return true
		}

		return rp(options).then(function(data){
			let sortedResults = _.sortBy(data.artists, [e=>_.intersection(body.genres, e.genres).length, 'popularity'])
			return sortedResults
			.filter(e=>{
					return _.intersection(body.genres, e.genres).length > 0
			})
			.reverse()
			.map(e=>{
				return{
					name:e.name,
					genres:_.intersection(body.genres, e.genres),
					popularity:e.popularity
				}
			})
		})
	}
// }




auth.then(getGenres('4tZwfgrHOc3mvqYlEYSvVi'))
	.then(findSimilar)
	.then(e=>console.log(e))
// auth.then(example)


// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     // use the access token to access the Spotify Web API
//     var token = body.access_token;
//     var options = {
//       url: 'https://api.spotify.com/v1/artists/4tZwfgrHOc3mvqYlEYSvVi',
//       headers: {
//         'Authorization': 'Bearer ' + token
//       },
//       json: true
//     };
				// return request.get(options, function(error, response, body) {
				// 	console.log(body)
				// 	// let test = body.albums.items.map(e=>e.name)	
				// })

//   }
// });