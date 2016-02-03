var express = require('express');
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

// Load the models.FUTURE
//app.models = require('./models/index');

// Load the routes.FUTURE
//var routes = require('./routes');
//_.each(routes, function(controller, route) {
//  app.use(route, controller(app, route));
//});

var epSystem = require('./controllers/EPSystemController');

app.get('/RestartAllServices',epSystem.RestartAllServices);
//TimeZone
app.all('/UpdateTimeZone',epSystem.UpdateTimeZone);
app.all('/GetTimeZone',epSystem.GetTimeZone);
//Service status
app.all('/GetServiceStatus',epSystem.GetServiceStatus);
app.all('/IsServiceRunning',epSystem.IsServiceRunning);
app.all('/StartService',epSystem.StartService);
app.all('/StopService',epSystem.StopService);
//Configuration
app.all('/GetConfFile',epSystem.GetConfFile);
app.all('/GetLogstashConfigDirectoryListing',epSystem.GetLogstashConfigDirectoryListing);
app.all('/GetCronJobDirectory',epSystem.GetCronJobDirectory);
app.all('/GetElasticConfigDirectoryListing',epSystem.GetElasticConfigDirectoryListing);
app.all('/UpdateConfFile',epSystem.UpdateConfFile);
app.all('/DeleteConfFile',epSystem.DeleteConfFile);
app.all('/ValidateLogstashFile',epSystem.ValidateLogstashFile);
//user methods
app.all('/UpdateUser',epSystem.UpdateUser);
app.all('/DeleteUser',epSystem.DeleteUser);
app.all('/ListUsers',epSystem.ListUsers);

console.log('Listening on port 3000...');
app.listen(3000, '127.0.0.1');
