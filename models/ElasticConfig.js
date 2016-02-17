
var mongoose = require('mongoose');

// Create the MovieSchema.
var ElasticSchema = new mongoose.Schema({
  fileLocation: {
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  },

});

// Export the model.
module.exports = mongoose.model('elastic', ElasticSchema);
