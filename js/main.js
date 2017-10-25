

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