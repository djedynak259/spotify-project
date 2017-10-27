let request = require('request');
let rp = require('request-promise'); 
let _ = require('lodash');
let util = require('util')


let client_id = '13ff1a4fe1a743269c9153a2c3af1dea'; 
let client_secret = 'fbf7f9a8b97a4f299db06d298e352e85'; 

let artistOfInterest = {
	name: 'Daft Punk',
	id:'4tZwfgrHOc3mvqYlEYSvVi'
}

// application requests authorization
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


// Authentication
let auth = rp.post(authOptions)
	.then(resp=>{
		return {
			access_token:resp.access_token
		}
	})
	.catch(error=> console.log(error))

// get Genres of artist
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

		return rp(options)
			.then(e=>{
				console.log(e.genres)
				return {
					access_token:body.access_token,
					artistOfInterest: artistOfInterest,
					genres:	e.genres			
				}
			}).catch(error=> console.log(error))
	}
}	

// Find Similar Artists

let findSimilarArtists = function(body){
	let token = body.access_token;
	let options = {
	  url: 'https://api.spotify.com/v1/artists/4tZwfgrHOc3mvqYlEYSvVi/related-artists',
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

		console.log(`\nArtists related to ${body.artistOfInterest.name} sorted by similarity and then popularity\n`, resultsToLog)

		return {
			access_token: token,
			artists:resultsToReturn
		}
	})
}

// findPopularAlbums from Artist

let findArtistAlbumsIds = function(body){
	let token = body.access_token;
	let commonOptions = {
	  headers: {
	    'Authorization': 'Bearer ' + token
	  },
	  json: true
	};

	return Promise.all(body.artists.map(e=>{
		let artistOption = {
			url: `https://api.spotify.com/v1/artists/${e.id}/albums?market=US&limit=4`,
			headers:commonOptions.headers,
			json: commonOptions.json
		}

		let findAlbumsPromise = rp(artistOption)
			.then(data=>{
				return {
					artist:e.artistName,
					album_ids:data.items.map(j=>j.id)
				}
		})

		return findAlbumsPromise

	}))
	.then(data=>{
		return {
			access_token: token,
			artist_albums: data
		}
	})

}

// Find Top Three Albums by Popularity

let topThreeAlbumsByPopularity = function(body){
	let allAlbumsForArtist=[]
	let token = body.access_token;
	let commonOptions = {
	  headers: {
	    'Authorization': 'Bearer ' + token
	  },
	  json: true
	};

	return Promise.all(body.artist_albums.map(e=>{

		return Promise.all(e.album_ids.map(f=>{
			let albumOptions = {
				url: `https://api.spotify.com/v1/albums/${f}`,
				headers:commonOptions.headers,
				json: commonOptions.json
			}			
			return rp(albumOptions)
				.then(data=> {
					let album = {
						id: data.id,
						artist: e.artist,
						album_name: data.name,
						popularity: data.popularity,
						tracks_href: data.tracks.href
					}
					return album
				})
				.catch(error=> console.log(error))		
		}))			
		.then(result=>{
			result = result.sort((a,b)=>b.popularity-a.popularity).slice(0,3)
			return {
				artist: e.artist, 
				top_albums: result
			}
		})

	}))
	.then(r=>{
		let resultsToLog = r.map(t=>{
			return {
				artist: t.artist,
				top_albums: t.top_albums.map(p=>({album_name: p.album_name, popularity: p.popularity}))
			}
		})
		console.log('\nTop 3 Albums by popularity for artists similar to Daft Punk\n',util.inspect(resultsToLog, false, null))
		return r
	})
}

// Run Code
auth.then(getGenres(artistOfInterest))
	.then(findSimilarArtists)
	.then(findArtistAlbumsIds)
	.then(topThreeAlbumsByPopularity)
	// .then(r=>r.map(j=>console.log(j)))
	// .then(e=>console.log('done',e))
	// .catch(error=> console.log(error))


// let example = function(body){
// 	let token = body.access_token;
// 	let options = {
// 	  url: 'https://api.spotify.com/v1/search?q=tania%20bowra&type=artist&limit=50',
// 	  headers: {
// 	    'Authorization': 'Bearer ' + token
// 	  },
// 	  json: true
// 	};
// 	return rp(options).then(e=>console.log(e)).catch((error)=>try{throw new Error(error)}catch(e){console.log(e)})
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