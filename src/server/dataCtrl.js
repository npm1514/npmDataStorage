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
      let referrers = []
      result.map(a => {
        if(a.type == "pageload") pageload++;
        if(a.type == "click") click++;
        if(a.referrer) referrers.push(a.referrer);
      })
      let formattedData = {
        total: result.length,
        pageload: pageload,
        click: click,
        referrers: referrers
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
