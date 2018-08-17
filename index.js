const express = require('express');
const funcs = require('./functions.js');

const app = express();

app.use(express.static('public'));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

app.get('/tabs/:artist/:title', async (req, res) => {
	res.send(await funcs.fetchTabs(req.params));
});

app.get('/lyrics/:artist/:title', async (req, res) => {
	res.send(await funcs.fetchLyrics(req.params));
});

app.get('/itunes/:artist/:title', async (req, res) => {
	res.send(await funcs.fetchInfo(req.params));
});

app.get('/api/:artist/:title', async (req, res, next) => {
  try {
	  const info = await funcs.fetchInfo(req.params);
    if (info == 'Not found') {
      res.json(info);
      return;
    }

    const at = {
      artist : info.artistName,
      title  : info.trackName
    };

    const [tabsUrl, lyrics] = await Promise.all([
      funcs.fetchTabs(at),
      funcs.fetchLyrics(at)
    ]);

    res.send({
      artistName   : info.artistName,
      trackName    : info.trackName,
      trackViewUrl : info.trackViewUrl,
      artworkUrl   : info.artworkUrl100,
      releaseDate  : new Date(info.releaseDate).toDateString(),
      genre        : info.primaryGenreName,
      tabsUrl      : tabsUrl,//await funcs.fetchTabs(at),
      lyrics       : lyrics//await funcs.fetchLyrics(at)
    });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.json('Not found');
});

app.listen(3000, function() {
	console.log('App is listening on port 3000!');
});

/*
 * Created by Michael Kaskun
 * tmikent@gmail.com
 * 
 * API's used:
 * 
 * Lyrics API
 * https://lyricsovh.docs.apiary.io/#reference/0/lyrics-of-a-song/search
 * 
 * Tabs API
 * https://www.songsterr.com/a/wa/api/
 * 
 * ITunes API
 * https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/
 * 
 */
