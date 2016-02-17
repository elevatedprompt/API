var mongoose = require('mongoose');

// Create the MovieSchema.
var SystemSettingsSchema = new mongoose.Schema({
  timezone: {
    type: String,
    required: true
  },
  logstashdeletedays: {
    type: Number,
    required: true
  },
  logstashclosedays: {
    type: Number,
    required: true
  },
  logstashstatus:{
    type: Boolean,
    required: true,
    default: false
  },
  kibanastatus:{
    type: Boolean,
    required: true,
    default: false
  },
  elasticsearchstatus:{
    type: Boolean,
    required: true,
    default: false
  },
});

// Export the model.
module.exports = mongoose.model('systemsettings', SystemSettingsSchema);
