import express from "express";
import fetch from "node-fetch";
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import mongoose from 'mongoose';

const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.key);

import dataCtrl from './server/dataCtrl';

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

app.post('/addData', dataCtrl.create);
app.get('/readRawData', dataCtrl.readRaw);
app.get('/readFormattedData', dataCtrl.readFormatted);
app.put('/updateData/:id', dataCtrl.update);
app.delete('/deleteData/:id', dataCtrl.delete);

var mongoUri = 'mongodb://'+cryptr.decrypt(config.dbuser)+':'+cryptr.decrypt(config.dbpass)+'@ds339648.mlab.com:39648/npm-data-storage';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error'));
mongoose.connection.once('open', function(){
  console.log("Connected to mongoDB");
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
