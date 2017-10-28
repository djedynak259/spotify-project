# spotify-project

Run main.js file with Node.js to execute code.  Below is a list of main functions used to achieve results.


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



# getGenres
	Uses Spotify Oauth API find listed genres of desired artist, in this case, Daft Punk.

# findSimilarArtists
	The spofiy API docs do not list endpoints to search by specific genre, so I used the related artists endpoint.