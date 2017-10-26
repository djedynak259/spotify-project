var request = require('request'); // "Request" library

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

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/search?q=daft+punk&type=album',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
    	let test = body.albums.items.map(e=>e.name)
    		console.log(test)
    })
  }
});




let base = 'https://api.spotify.com/';
let albumSearch='v1/search?q=michael+jackson&type=album'

// fetch(base+albumSearch).then(response=>response.json()).then(resp=>console.log(resp))

// fetch('https://accounts.spotify.com/api/token').then(response=>response.json()).then(resp=>console.log(resp))






// function search(){

// 	while (imageList.hasChildNodes()) {
//     imageList.removeChild(imageList.lastChild);
// 	}

// 	var searchValue = document.getElementById("searchBox").value;
// 	console.log(searchValue)
// 	var xhr = $.get(`http://api.giphy.com/v1/gifs/search?q=${searchValue}&api_key=a5c163ee9c29473580e365c6cc226a99&limit=6`);
// 	xhr.done(function(data) { 
// 			console.log("success got data", data); 	

// 	for(let i=0; i < 6;i++){
// 		console.log(data.data[i].images.downsized.url)
// 		var img = document.createElement('img');		
// 		var li = document.createElement('li');
// 		var list = document.getElementById('imageList');
// 		img.setAttribute('src', data.data[i].images.downsized.url);
// 		li.appendChild(img);
// 		list.appendChild(li);
	
// 	}

// 	});

// }