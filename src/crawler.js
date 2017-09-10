const {createError} = require('micro');
const request = require('superagent');
const {JSDOM} = require('jsdom');

async function load(url) {
  try {
    const res = await request.get(url);
    return res.text;
  } catch (err) {
    throw createError(err.statusCode || 500, 'Cannot load playlist', err);
  }
}

function parse(html) {
  const {document} = new JSDOM(html).window;
  const $items = [...document.querySelectorAll('.chart .song_title')];

  return $items.map($item => {
    const artist = $item.querySelector('.artist_name').textContent;
    const song = $item.querySelector('.song_name').textContent;

    return `${artist} ${song}`;
  });
}

module.exports = async function() {
  const url = 'http://hotcharts.ru/europaplus';

  const html = await load(url);
  const items = parse(html);

  return items;
};
