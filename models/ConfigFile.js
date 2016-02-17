
var mongoose = require('mongoose');

// Create the MovieSchema.
var ConfigFileSchema = new mongoose.Schema({
  //the configuration file name
  filename: {
    type: String,
    required: true
  },
  active: {
    type:Boolean,
    required: true
  },
  version: {
    type:String,
    required:true,
    default:1
  },
  createddate: {
    type:Date,
    default: Date.now
  },
  //the configuration file to be written
  configuration: {
    type: String,
    required: true
  }
});

// Export the model.
module.exports = mongoose.model('configfile', ConfigFileSchema);
