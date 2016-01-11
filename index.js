var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

// Create the application.
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

// Load the models.
app.models = require('./models/index');

// Load the routes.
var routes = require('./routes');
_.each(routes, function(controller, route) {
  app.use(route, controller(app, route));
});

var epSystem = require('./controllers/EPSystemController');

app.get('/RestartAllServices',epSystem.RestartAllServices);
app.all('/UpdateTimeZone',epSystem.UpdateTimeZone);
app.all('/GetTimeZone',epSystem.GetTimeZone);
app.all('/GetConfFile',epSystem.GetConfFile);
app.all('/GetServiceStatus',epSystem.GetServiceStatus);
app.all('/IsServiceRunning',epSystem.IsServiceRunning);
app.all('/StartService',epSystem.StartService);
app.all('/StopService',epSystem.StopService);
//app.all('/GetCronJobs',epSystem.GetCronJobs);
app.all('/GetLogstashConfigDirectoryListing',epSystem.GetLogstashConfigDirectoryListing);
app.all('/GetCronJobDirectory',epSystem.GetCronJobDirectory);
app.all('/GetElasticConfigDirectoryListing',epSystem.GetElasticConfigDirectoryListing);

app.all('/UpdateConfFile',epSystem.UpdateConfFile);
//app.all('/UpdateCronJobs',epSystem.UpdateCronJobs);

console.log('Listening on port 3000...');
app.listen(3000, '127.0.0.1');

// Connect to MongoDB
//mongoose.connect('mongodb://192.168.1.71/adminpanel');
//mongoose.connection.once('open', function() {

  // Load the models.
//  app.models = require('./models/index');

  // Load the routes.
//  var routes = require('./routes');
//  _.each(routes, function(controller, route) {
//    app.use(route, controller(app, route));
//  });

//SETUP calls to restart services.
//  var epSystem = require('./controllers/EPSystemController');
//  app.get('/RestartAllServices',epSystem.RestartAllServices);

//  console.log('Listening on port 3000...');
//  app.listen(3000);
//});
