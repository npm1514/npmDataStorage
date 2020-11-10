var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var Data = require('./dataModel');

export default {
  create: function(req, res) {
    var reference = new Data(req.body);
    reference.save((err, result) => {
      if (err) res.send(err);
      res.send(result);
    });
  },
  readFormatted: function(req, res) {
    Data
    .find(req.query)
    .populate()
    .exec(function (err, result) {
      console.log(result);
      let pageload = 0;
      let click = 0;
      let referrerList = [];
      let clickList = [];
      result.map(a => {
        if(a.type == "pageload") pageload++;
        if(a.type == "click") click++;
        if(a.referrer) {
          if(a.referrer[a.referrer.length - 1] == "/") a.referrer = a.referrer.slice(0,a.referrer.length - 1)
          referrerList.push(a.referrer);
        }
        if(a.clickThing) {
          clickList.push(a.clickThing);
        }
      })
      let referrers = {};
      for (let i = 0; i < referrerList.length; i++) {
          referrers[referrerList[i]] = 1 + (referrers[referrerList[i]] || 0);
      }
      let clickers = {};
      for (let i = 0; i < clickList.length; i++) {
          clickers[clickList[i]] = 1 + (clickers[clickList[i]] || 0);
      }
      let formattedData = {
        total: result.length,
        pageload: pageload,
        click: click,
        referrers: referrers,
        clickers: clickers
      }
      res.send(formattedData);
    });
  },
  readRaw: function(req, res) {
    Data
    .find(req.query)
    .populate()
    .exec(function (err, result) {
      res.send(result);
    });
  },
  update: (req, res) => {
    Data
    .findByIdAndUpdate(req.params.id, req.body, (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    });
  },
  delete: (req, res) => {
    Data
    .findByIdAndRemove(req.params.id, req.body, (err, result) => {
      if (err) res.send(err);
      res.send(result);
    });
  },
  removeLocalhost: (req, res) => {
    Data
    .find(req.query)
    .populate()
    .exec(function (err, result) {
      result.map((datum) => {
        if(datum.url == "http://localhost:3003"){
          Data
          .findByIdAndRemove(datum._id, {}, (err, result) => {
            console.log(datum._id + " removed");
          });
        }
      })
      Data
      .find(req.query)
      .populate()
      .exec(function (err, result) {
        res.send(result);
      });
    });
  }
};
