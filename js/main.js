var request = require('request');
var rp = require('request-promise'); // "Request" library

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

// get Genres
let getGenres = function(body){
	var token = body.access_token;
	var options = {
	  url: 'https://api.spotify.com/v1/artists/4tZwfgrHOc3mvqYlEYSvVi',
	  headers: {
	    'Authorization': 'Bearer ' + token
	  },
	  json: true
	};

	let genres = rp(options).then(e=>e.genres).catch(errorHandle)
		return rp(options).then(e=>e.genres).catch(errorHandle)


}


let findSimilar = function(body){
	// return function(body){
		var token = body.access_token;
		var options = {
		  url: 'https://api.spotify.com/v1/artists/4tZwfgrHOc3mvqYlEYSvVi/related-artists&limit=50',
		  headers: {
		    'Authorization': 'Bearer ' + token
		  },
		  json: true
		};
		return rp(options).then(function(data){
			return data.artists.includes(e=>{
				return JSON.stringify(e.genres) == JSON.stringify(body)
			})
		})
		.then(e=>console.log(e)).catch(errorHandle)
	}
// }


let auth = rp.post(authOptions)
// auth.then(getGenres)
auth.then(findSimilar)


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