import express from "express";
import fetch from "node-fetch";
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.key);

var PORT = process.env.PORT || 3006;

const app = express();
app.use(compression());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.get('/', (req, res) => {
  let data = "";
  res.set('Cache-Control', 'public, max-age=31557600');
  res.send("ok");
});

app.listen( PORT, () => {
  console.log('Running on http://localhost:' + PORT)
});


// functions!!!!!!!!!!!!!

function getQueries(req, res){
  const qOb = {};
  const queries = req && req._parsedUrl && req._parsedUrl.query && req._parsedUrl.query.split('&') ? req._parsedUrl.query.split('&') : [];
  if(queries.length){
    queries.forEach((x) => {
        var y = x.split('=');
        qOb[y[0]] = y[1];
    });
  }
  return qOb;
}

function fetcher(url){
	return fetch(url)
    .then((response) => {
        if(response.status !== 200) throw Error(response.statusText);
        return response.json();
    }).then((json) => {
        return json;
    }).catch(errHandle)
}

function errHandle(err){
    console.log(err);
}
