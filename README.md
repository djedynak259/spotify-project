# spotify-project


## Run Project
Run main.js file with Node.js to execute code.  Below is a list of main functions and descriptions used to achieve results.


## getGenres
Uses Spotify Oauth API find listed genres of desired artist, in this case, Daft Punk.

## findSimilarArtists
The spofiy Endpoint API docs does not list endpoints to search by specific genre, so I used the related artists endpoint to return a list of related artists.

## findArtistAlbumsIds	
The album search by artist API allows 50 results max, and some artists have over 50 albums.  This function generates a list of ALL U.S. albums per artist using the offset header and returns a list of album ids.  If desired, this function can easily be altered to only allow full length albums.  (currently albums and singles are included)

## topThreeAlbumsByPopularity
The previous set of api calls does not include popularity of each album. This function sses album ids to find album details including popularity.  Albums are sorted by popularity and anything below the top 3 are filtered out.

## setListSongsInAlbum
Finds all track names for each of the top 3 albums.  The numTracksToUse equation determines how may tracks are used from each album based on relative popularity of each album.  An issue I came across was popular singles containing 1-2 tracks that could not support the track demand for it's popularity ratio.  I added logic to account for this by selecting tracks from the singles first, and tracking the remaining tracks needed for each set list.  Once tracks are selected, sorting order by album popularity is restored.  

This function returns data for the setlist organized by album.  This allows the viewer to see popularity and total number of tracks per album in addition to the tracks picked from each album.



By the way, this code would be an amaziny way to use the spotify API to discover new artists and tracks to DJ ;)
