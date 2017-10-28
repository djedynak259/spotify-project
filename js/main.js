let request = require('request');
let rp = require('request-promise');
let _ = require('lodash');
let util = require('util')


let client_id = '13ff1a4fe1a743269c9153a2c3af1dea';
let client_secret = 'fbf7f9a8b97a4f299db06d298e352e85';

let artistOfInterest = {
    name: 'Daft Punk',
    id: '4tZwfgrHOc3mvqYlEYSvVi'
}

// application requests authorization

let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret)
            .toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};


// Authentication

let auth = rp.post(authOptions)
    .then(resp => {
        return {
            access_token: resp.access_token
        }
    })
    .catch(error => console.log(error))

// Get Genres of Artist

let getGenres = function(artistOfInterest) {
    return function(body) {
        let token = body.access_token;

        let options = {
            url: `https://api.spotify.com/v1/artists/${artistOfInterest.id}`,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
        };

        return rp(options)
            .then(e => {
                console.log(`Genres listed for the artist ${artistOfInterest.name}\n`, e.genres)
                return {
                    access_token: body.access_token,
                    artistOfInterest: artistOfInterest,
                    genres: e.genres
                }
            })
            .catch(error => console.log(error))
    }
}


// Find Similar Artists

let findSimilarArtists = function(body) {
    let token = body.access_token;
    let options = {
        url: `https://api.spotify.com/v1/artists/${body.artistOfInterest.id}/related-artists`,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    return rp(options)
        .then(data => {
            let sortedResults = _.sortBy(data.artists, [e => _.intersection(body.genres, e.genres)
                    .length, 'popularity'
                ])
                .filter(e => {
                    return _.intersection(body.genres, e.genres)
                        .length > 0
                })
                .reverse()

            let resultsToLog = sortedResults
                .map(e => {
                    return {
                        name: e.name,
                        genres: _.intersection(body.genres, e.genres),
                        popularity: e.popularity
                    }
                })

            let resultsToReturn = sortedResults
                .map(e => {
                    return {
                        id: e.id,
                        artistName: e.name,
                    }
                })

            console.log(`\nArtists related to ${body.artistOfInterest.name} sorted by similarity and then popularity\n`, resultsToLog)

            return {
                access_token: token,
                artists: resultsToReturn,
                artistOfInterest: body.artistOfInterest
            }
        })
}


// Find Popular Albums From Artist

let findArtistAlbumsIds = function(body) {
    let token = body.access_token;
    let commonOptions = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    return Promise.all(body.artists
            .map(e => {
                let artistTotalAlbumsOption = {
                    url: `https://api.spotify.com/v1/artists/${e.id}/albums?market=US&offset=0&limit=1`,
                    headers: commonOptions.headers,
                    json: commonOptions.json
                }

                return rp(artistTotalAlbumsOption)
                    .then(resp => {
                        let artistOptionOffset = (i) => {
                            return {
                                url: `https://api.spotify.com/v1/artists/${e.id}/albums?market=US&offset=${i}&limit=50`,
                                headers: commonOptions.headers,
                                json: commonOptions.json
                            }
                        }
                        let total = [];
                        for (let i = 0; i <= resp.total; i += 50) {
                            total.push(rp(artistOptionOffset(i))
                                .then(g => g.items.map(j => j.id)))
                        }
                        return Promise.all(total)
                    })
                    .then(data => {
                        data = _.flatten(data)
                        return {
                            artist: e.artistName,
                            album_ids: data
                        }
                    })

            })
        )
        .then(data => {
            return {
                access_token: token,
                artist_albums: data,
                artistOfInterest: body.artistOfInterest
            }
        })

}


// Find Top Three Albums by Popularity

let topThreeAlbumsByPopularity = function(body) {
    let token = body.access_token;
    let commonOptions = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    return Promise.all(body.artist_albums
            .map(e => {
                let totalAlbums = []
                while (e.album_ids.length > 0) {
                    let albumsString = e.album_ids.splice(0, 19)
                        .join()
                    let albumOptions = {
                        url: `https://api.spotify.com/v1/albums/?ids=${albumsString}`,
                        headers: commonOptions.headers,
                        json: commonOptions.json
                    }
                    totalAlbums.push(rp(albumOptions))
                }
                return Promise.all(totalAlbums)
                    .then(data => {
                        return _.flatten(data.map(t => t.albums))
                            .map(f => {
                                return {
                                    id: f.id,
                                    artist: e.artist,
                                    album_name: f.name,
                                    popularity: f.popularity
                                }
                            })
                            .sort((a, b) => b.popularity - a.popularity)
                            .slice(0, 3)
                    })
                    .then(res => {
                        return {
                            artist: e.artist,
                            top_albums: res
                        }
                    })
                    .catch(error => console.log(error))
            })
        )
        .then(r => {
            let resultsToLog = r
                .map(t => {
                    return {
                        artist: t.artist,
                        top_albums: t.top_albums.map(p => ({
                            album_name: p.album_name,
                            popularity: p.popularity
                        }))
                    }
                })

            let resultsToReturn = {
                artistOfInterest: body.artistOfInterest,
                access_token: body.access_token,
                artist_top_albums: r
            }

            console.log(`\nTop 3 popular albums for each artists similar to ${body.artistOfInterest.name}\n`, util.inspect(resultsToLog, false, null))

            return resultsToReturn
        })
}


// Build Setlists With Top 3 Albums

let songsInAlbum = function(body) {
    let token = body.access_token;
    let commonOptions = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    return Promise.all(body.artist_top_albums
            .map(e => {
                return Promise.all(e.top_albums
                        .map(g => {
                            let pop = g.popularity
                            let albumTrackOptions = {
                                url: `https://api.spotify.com/v1/albums/${g.id}/tracks?limit=50`,
                                headers: commonOptions.headers,
                                json: commonOptions.json
                            }
                            return rp(albumTrackOptions)
                                .then(resp => {
                                    return {
                                        album_name: g.album_name,
                                        popularity: g.popularity,
                                        tracks_on_album: resp.total,
                                        track_names: resp.items.map(j => (j.name))
                                    }
                                })
                        })
                    )
                    .then(data => {
                        let totalPop = data.reduce((a, b) => ({
                            popularity: a.popularity + b.popularity
                        }))
                        let tracksLeft = 15
                        data.sort((a, b) => a.tracks_on_album - b.tracks_on_album)
                        return {
                            artist: e.artist,
                            set_list: data
                                .map((e, i) => {
                                    let numTracksToUse = Math.round(e.popularity * tracksLeft * 3 / (3 - i) / totalPop.popularity)
                                    let tracks = i !== 2 ? e.track_names.slice(0, numTracksToUse) : e.track_names.slice(0, tracksLeft)
                                    tracksLeft -= tracks.length

                                    return {
                                        album_name: e.album_name,
                                        popularity: e.popularity,
                                        total_tracks_on_album: e.tracks_on_album,
                                        track_names_for_set: tracks
                                    }
                                })
                                .sort((a, b) => b.popularity - a.popularity)
                        }
                    })
            })
        )
        .then(data => {

            console.log(`\n 15 song setlists based on top 3 albums of each artist similar to ${body.artistOfInterest.name}, songs selected based on ratios of album popularity\n`, util.inspect(data, false, null))

            return {
                artistOfInterest: body.artistOfInterest,
                access_token: body.access_token,
                setlist_data: data
            }
        })
}


// Run Code

auth.then(getGenres(artistOfInterest))
    .then(findSimilarArtists)
    .then(findArtistAlbumsIds)
    .then(topThreeAlbumsByPopularity)
    .then(songsInAlbum)
    .catch(error => console.log(error))

