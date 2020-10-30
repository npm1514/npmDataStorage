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
  read: function(req, res) {
    Role
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
  }
};
