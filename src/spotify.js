const SpotifyApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
});

async function init() {
  const res = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(res.body.access_token);
}

async function getTrack(name) {
  const res = await spotifyApi.searchTracks(name, {limit: 1});
  return res.body.tracks.items[0];
}

async function updatePlaylist({playlistId, username, trackNames}) {
  const tracks = await Promise.all(
    trackNames.map(async name => {
      const track = await getTrack(name);
      const id = track && track.uri;

      return {
        id,
        name,
      };
    }),
  );

  await spotifyApi.replaceTracksInPlaylist(
    username,
    playlistId,
    tracks.filter(({id}) => id).map(({id}) => id),
  );

  return tracks.filter(({id}) => !id).map(({name}) => name);
}

module.exports = async function(tracks) {
  await init();

  return await updatePlaylist({
    playlistId: '2h4IND1KLpxTPYYTtTQchk',
    username: 'shpuntik',
    trackNames: tracks,
  });
};
