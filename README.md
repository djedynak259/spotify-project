# spotify-project

Prompt

In​ ​this​ ​scenario​ ​you​ ​are​ ​a​ ​growth​ ​engineer​ ​helping​ ​to​ ​plan​ ​a​ ​US​ ​tour​ ​for​ ​French​ ​electro supergroup​ ​Daft​ ​Punk.​ ​The​ ​planners​ ​blew​ ​the​ ​budget​ ​on​ ​lights​ ​and​ ​audio​ ​equipment,​ ​and require​ ​some​ ​cheap​ ​and​ ​quick​ ​analysis​ ​to​ ​make​ ​sure​ ​the​ ​tour​ ​is​ ​a​ ​success.​ ​Using​ ​Spotify’s​ ​API (to​ ​save​ ​money​ ​of​ ​course),​ ​please​ ​answer​ ​the​ ​following​ ​questions:

1) First​ ​we​ ​need​ ​to​ ​get​ ​some​ ​opening​ ​acts.​ ​There​ ​are​ ​two​ ​categories:​ ​similarity​ ​and popularity.​ ​Popularity​ ​you​ ​can​ ​get​ ​from​ ​the​ ​API.​ ​Similarity​ ​is​ ​a​ ​metric​ ​we​ ​define​ ​as​ ​how close​ ​a​ ​related​ ​artist’s​ ​genre​ ​tags​ ​match​ ​Daft​ ​Punk’s​ ​genre​ ​tags.​ ​Return​ ​a​ ​list​ ​of​ ​similar artists​ ​sorted​ ​first​ ​by​ ​similarity,​ ​then​ ​popularity.

2) We​ ​want​ ​to​ ​make​ ​sure​ ​the​ ​tour​ ​performs​ ​well.​ ​Find​ ​the​ ​top​ ​3​ ​albums​ ​by​ ​popularity available​ ​in​ ​the​ ​US​ ​for​ ​each​ ​artist.​ ​This​ ​should​ ​help​ ​the​ ​artists​ ​organize​ ​their​ ​song selection.

3) The​ ​artists​ ​claim​ ​they​ ​“don’t​ ​understand​ ​Americans”​ ​and​ ​give​ ​up​ ​on​ ​organizing​ ​their​ ​own song​ ​selection​ ​for​ ​the​ ​concert.​ ​Using​ ​the​ ​top​ ​3​ ​albums,​ ​create​ ​a​ ​15​ ​song​ ​setlist.​ ​Each album​ ​should​ ​contribute​ ​X​ ​number​ ​of​ ​songs​ ​to​ ​the​ ​setlist​ ​where​ ​X​ ​is​ ​proportional​ ​to​ ​that album’s​ ​relative​ ​popularity.

4) Now​ ​that​ ​you​ ​are​ ​familiar​ ​with​ ​the​ ​API​ ​and​ ​its​ ​data​ ​model,​ ​it​ ​is​ ​time​ ​to​ ​utilize​ ​this knowledge​ ​to​ ​evaluate​ ​a​ ​marketing​ ​channel.​ ​For​ ​the​ ​following​ ​questions,​ ​assume​ ​that you​ ​have​ ​the​ ​ability​ ​to​ ​serve​ ​ads​ ​directly​ ​to​ ​users​ ​on​ ​the​ ​Spotify​ ​platform.
	a) Explain​ ​which​ ​endpoint(s)​ ​you​ ​would​ ​use​ ​to​ ​target​ ​a​ ​user​ ​and​ ​how​ ​you​ ​would determine​ ​if​ ​the​ ​ad​ ​yielded​ ​a​ ​positive​ ​ROI.
	b) Describe​ ​a​ ​lightweight​ ​test​ ​to​ ​validate​ ​this​ ​hypothesis.
	c) Assuming​ ​the​ ​test​ ​is​ ​successful,​ ​describe​ ​how​ ​you​ ​would​ ​scale​ ​the​ ​channel​ ​to
	better​ ​target​ ​users​ ​overtime.



## Run Project
Run main.js file with Node.js to execute code.  Below is a list of main functions and descriptions used to achieve results.


## getGenres
Uses Spotify Oauth API find listed genres of desired artist, in this case, Daft Punk.

## findSimilarArtists
The spofiy Endpoint API docs does not list endpoints to search by specific genre, so I used the related artists endpoint to return a list of related artists.

## findArtistAlbumsIds	
The album search by artist API allows 50 results max, and some artists have over 50 albums.  This function generates a list of ALL albums per artist using the offset header and returns a list of album ids.

## topThreeAlbumsByPopularity
Uses album ids to find album details including popularity.  Albums are sorted by popularity and anything below the top 3 are filtered out.

## setListSongsInAlbum
Finds all track names for each of the top 3 albums.  The numTracksToUse equation determines how may tracks are used from each album based on relative popularity of each album.  This accounts for singles that may only have 1-2 tracks by monitoring the number of remaining tracks needed for each set list.  Once tracks are selected, sorting order by album popularity is restored.  

This function returns data for the setlist organized by album.  By showing this extra data, this allows the viewer to see popularity and total number of tracks per album in addition to the tracks picked from each album.

## Answers to questions in Promp #4

a) Which Enpoints to Target Wsers - 

First I would make note of the age range, most listened to genres, geography and gender of Eaze users, likely based on previous studies.  With this data, I would use enpoints focused on these demographics in order to pinpoint which spotify users to target.  (It appears that Spotify for Brands has access to different endpoints than the open web API - https://spotifyforbrands.com/us/targeting/)  

To measure ROI, i would measure the click-throught on the ad itself that resulted in submitting contact information. Google analytics can be used to see if search results increased as a result of the new ad as well, although this data is less direct.

b) Lightwight Test to Validate Hypothesis-

First I would define a hypothesis.  For example: ad will result in 200-click throughs per week.  Or, click-throughs from ad will result in 50 new signups per week.  

If I am A/B testing two different ads, I would ensure they both are shown to indentical audiences and measure click-through data of both ads over a set amount of time.  

If this test is designed to determine whether or not we will continue using this marketing channel, i would suggest 2 rounds of on/off tests by monitoring click-through signup and website visit data while phasing the ad on-line and then off-line, each for an identical set amout of time.

c) Scaling the Test - 

For positive results when testing a variety ads, I would look for the differences in the ads that resulted in more click-throughs and continue to design ads according to these differences.

As/If success continues I would continue to scale the channel by testing a wider age group, further experiments with gender, and additional genres.  Tests that don't meet a desired ROI would not be scaled.

Scaling this channel would be a good opportunity to add many more locations to this test.  By measure data by location, results could influence the cities that Eaze chooses to expand to next.
