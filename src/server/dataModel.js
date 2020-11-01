var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
  type: { type: String },
  date: { type: Date },
  url: { type: String },
  device: {},
  referrer: String,
  screen: {},
  performance: {},
  clickThing: String
});
module.exports = mongoose.model('Data', dataSchema);
