const getTracks = require('./crawler');
const updatePlaylist = require('./spotify');

function formatResponse(items) {
  if (!items.length) {
    return '✅ All tracks were added to the playlist';
  }

  return items.reduce(
    (str, item) => `${str}- ${item}\n`,
    `⚠️ ${items.length} tracks were not found\n\n`,
  );
}

module.exports = async function() {
  const tracks = await getTracks();
  const notFoundTracks = await updatePlaylist(tracks);

  return formatResponse(notFoundTracks);
};
