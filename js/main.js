let request = require('request');
let rp = require('request-promise'); 
let _ = require('lodash');

let client_id = '13ff1a4fe1a743269c9153a2c3af1dea'; 
let client_secret = 'fbf7f9a8b97a4f299db06d298e352e85'; 

let artistOfInterest = {
	name: 'Daft Punk',
	id:'4tZwfgrHOc3mvqYlEYSvVi'
}

// your application requests authorization
let authOptions = {
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
let getGenres = function(artistOfInterest){
	return function(body){
		let token = body.access_token;
		let options = {
		  url: `https://api.spotify.com/v1/artists/${artistOfInterest.id}`,
		  headers: {
		    'Authorization': 'Bearer ' + token
		  },
		  json: true
		};
		return rp(options).then(e=>{
			console.log(e.genres)
			return {
				access_token:body.access_token,
				artistOfInterest: artistOfInterest,
				genres:	e.genres			
			}
		}).catch(errorHandle)
	}
}	

let findSimilarArtists = function(body){
	let token = body.access_token;
	let options = {
	  url: 'https://api.spotify.com/v1/artists/4tZwfgrHOc3mvqYlEYSvVi/related-artists?limit=50',
	  headers: {
	    'Authorization': 'Bearer ' + token
	  },
	  json: true
	};

	return rp(options).then(function(data){
		let sortedResults = _.sortBy(data.artists, [e=>_.intersection(body.genres, e.genres).length, 'popularity'])
		.filter(e=>{
				return _.intersection(body.genres, e.genres).length > 0
		})
		.reverse()

		let resultsToLog = sortedResults.map(e=>{
			return{
				name: e.name,
				genres:_.intersection(body.genres, e.genres),
				popularity: e.popularity
			}
		})

		let resultsToReturn = sortedResults.map(e=>{
			return{
				id:e.id,
				artistName: e.name,
			}
		})

		console.log(`Artists related to ${body.artistOfInterest.name} sorted by similarity and then popularity`, resultsToLog)

		return {
			access_token: token,
			artists:resultsToReturn
		}
	})
}

// findPopularAlbums from Artist

let findArtistAlbumsIds = function(body){
	let promiseArr=[]

	let token = body.access_token;
	let commonOptions = {
	  headers: {
	    'Authorization': 'Bearer ' + token
	  },
	  json: true
	};

	body.artists.forEach(e=>{
		let artistOption = {
			url: `https://api.spotify.com/v1/artists/${e.id}/albums?market=US&limit=50`,
			headers:commonOptions.headers,
			json: commonOptions.json
		}

		let findAlbumsPromise = rp(artistOption).then(data=>{
			return {
				artist:e.artistName,
				albums:data.items.map(j=>j.id)
			}
		})
		promiseArr.push(findAlbumsPromise)
	})

	return Promise.all(promiseArr).then(data=>{
		return {
				access_token: token,
				artistAlbums: data
		}
	})

}

// Find Top Three Albums by Popularity

let topThreeAlbumsByPopularity = function(body){
	let token = body.access_token;
	let commonOptions = {
	  headers: {
	    'Authorization': 'Bearer ' + token
	  },
	  json: true
	};

	body.artistAlbums.forEach(e=>{
		let albumOptions = {
			url: `hhttps://api.spotify.com/v1/albums/${id}`,
			headers:commonOptions.headers,
			json: commonOptions.json
		}

		rp(albumOptions)
		.then()
		.then()
		.then(e=>console.log(e)).catch(errorHandle)
	})
}


auth.then(getGenres(artistOfInterest))
	.then(findSimilarArtists)
	.then(findArtistAlbumsIds)
	// .then(topThreeAlbumsByPopularity)
	.then(e=>console.log('done',e))


// let example = function(body){
// 	let token = body.access_token;
// 	let options = {
// 	  url: 'https://api.spotify.com/v1/search?q=tania%20bowra&type=artist&limit=50',
// 	  headers: {
// 	    'Authorization': 'Bearer ' + token
// 	  },
// 	  json: true
// 	};
// 	return rp(options).then(e=>console.log(e)).catch(errorHandle)
// }

// auth.then(example)


// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     // use the access token to access the Spotify Web API
//     let token = body.access_token;
//     let options = {
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