# spotify-project


## Run Project
Run main.js file with Node.js to execute code.  Below is a list of main functions and descriptions used to achieve results.


## getGenres
Uses Spotify Oauth API find listed genres of desired artist, in this case, Daft Punk.

## findSimilarArtists
The spofiy Endpoint API docs does not list endpoints to search by specific genre, so I used the related artists endpoint to return a list of related artists.

## findArtistAlbumsIds	
The album search by artist API allows 50 results max, and some artists have over 50 albums.  This function generates a list of ALL U.S. albums per artist using the offset header and returns a list of album ids.  If desired, api call can easily be altered to only allow full length albums.  (currently albums and singles are included)

## topThreeAlbumsByPopularity
Uses album ids to find album details including popularity.  Albums are sorted by popularity and anything below the top 3 are filtered out.

## setListSongsInAlbum
Finds all track names for each of the top 3 albums.  The numTracksToUse equation determines how may tracks are used from each album based on relative popularity of each album.  This accounts for singles that may only have 1-2 tracks by monitoring the number of remaining tracks needed for each set list.  Once tracks are selected, sorting order by album popularity is restored.  

This function returns data for the setlist organized by album.  By showing this extra data, this allows the viewer to see popularity and total number of tracks per album in addition to the tracks picked from each album.



By the way, this code would be an amaziny way to use the spotify API to discover new artists and tracks to DJ.
