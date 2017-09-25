const request = require('superagent');
const {JSDOM} = require('jsdom');

async function load() {
  const res = await request.get('http://hotcharts.ru/europaplus');
  return res.text;
}

const replaceList = ['ft.?', 'feat.?', '&'].join('|');
const replaceRegex = new RegExp(`${replaceList}`, 'gi');

function parse(html) {
  const {document} = new JSDOM(html).window;
  const $items = [...document.querySelectorAll('.chart .song_title')];

  return $items.map($item => {
    const artist = $item.querySelector('.artist_name').textContent;
    const song = $item.querySelector('.song_name').textContent;

    return `${artist} ${song}`.replace(replaceRegex, '');
  });
}

module.exports = async function() {
  const html = await load();
  return parse(html);
};
