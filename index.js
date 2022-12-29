require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// an integer that will become shortened url that will keep incrementing and will be returned with post response
let shortUrl = 0;

// map that pairs original url to short url
const mapOriToShortUrl = new Map();
// map that pairs short url to original url
const mapShortToOriUrl = new Map();

// URL Shortener Post API endpoint
app.post('/api/shorturl/', function(req, res) {
  const oriUrl = new URL(req.body.url); // get the original url from request body
  if (oriUrl.protocol === 'https:' || oriUrl.protocol === 'http:') {
    // dns lookup can only process url hostname without protocol  
    const urlHostname = oriUrl.hostname;
    // check the validity of the hostname
    dns.lookup(urlHostname, (err, address, family) => {
      if (err === null) {
        if (mapOriToShortUrl.has(oriUrl)) {
          // long url has been shortened before, get value from mapOriToShortUrl
          res.json({ original_url: oriUrl, short_url: mapOriToShortUrl.get(oriUrl) });
        } else {
          // long url has never been shortened
          shortUrl += 1; // increase to prevent the same short url to be mapped to more than one long urls
          mapOriToShortUrl.set(oriUrl, shortUrl); // map the long url to short url
          mapShortToOriUrl.set(shortUrl, oriUrl); // map the short url to long url to be used later by GET request
          res.json({ original_url: oriUrl, short_url: shortUrl });
        }
      } else {
        // hostname is unreachable
        res.json({ error: 'Invalid Hostname' });
      }
    });
  } else {
    // url is invalid because not contain http/https protocol
    res.json({ error: 'Invalid URL' });
  }
});

// URL Shortener Get API endpoint
app.get('/api/shorturl/:shortUrl', function(req, res) {
  // cast the param to integer, then assign it to shortUrlParam
  const shortUrlParam = +req.params.shortUrl;
  if (mapShortToOriUrl.has(shortUrlParam)) {
    // the short url has been generated before, get the original url from short url
    const oriUrl = mapShortToOriUrl.get(shortUrlParam);
    // redirect to original url
    res.redirect(oriUrl);
  } else {
    // the short url is not valid and never been generated
    res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
