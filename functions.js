const fetch = require('node-fetch');
const utf8 = require('utf8');

const songsterr = (artist, title) =>
`http://www.songsterr.com/a/wa/bestMatchForQueryString?s=${title}&a=${artist}`;

const lyricsovh = (artist, title) =>
`https://api.lyrics.ovh/v1/${artist}/${title}`;

const itunes = (artist, title) =>
`https://itunes.apple.com/search?term=${artist}+${title}&limit=1`;

async function fetchInfo({ artist, title }) {
  const data = await fetch(utf8.encode(itunes(artist, title))).then(x => x.json());
  let info = {};
  if (data.resultCount == 0) {
    info = 'Not found';
  } else {
    info = data.results[0];
  }

  return info;
}

async function fetchLyrics({ artist, title }) {
  const data = await fetch(utf8.encode(lyricsovh(artist, title))).then(x => x.json());

  return data.error ? data.error : unifyLyrics(data.lyrics);
}

async function fetchTabs({ artist, title }) {
  const data = await fetch(utf8.encode(songsterr(artist, title)));
  
  return data.url;
}

function unifyLyrics(lyrics) {
  return lyrics.includes('\n\n\n')
    ? lyrics.replace(/\n\n/g, '\n')
    : lyrics;
}

module.exports = { fetchInfo, fetchLyrics, fetchTabs };