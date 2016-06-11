var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var moment = require('moment-timezone');
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

var epSystem = require('./controllers/EPSystemController');
var epNotificationSystem = require('./controllers/EPNotificationController');

global.tracelevel   = 'error';
global.elastichost  = '127.0.0.1:9200';
global.notificationsDirectory = '/opt/API/Notifications/';
global.elasticsearchLocation = '/etc/elasticsearch/';
global.logstashConfig = '/etc/logstash/conf.d/';
global.cronJobDirectory = '/var/spool/cron/crontabs/';
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

//notification methods.
app.all('/Notification/GetNotification',epNotificationSystem.GetNotification);
app.all('/Notification/GetNotifications',epNotificationSystem.GetNotifications);

/*Notification Functions*/
var notificationController = require('./controllers/notificationcontroller');
var elasticquery = require('./controllers/elasticquery');

//ElasticSearch Controller
app.all("/Notification/ListSearches",elasticquery.ListSearches);
app.all('/Notification/runSearch',elasticquery.runSearch);
app.all('/Notification/getQuery',elasticquery.getQuery);
app.all('/Notification/CallQuery',elasticquery.CallQuery);
app.all('/Notification/EvaluateSearch',elasticquery.EvaluateSearch);
app.all('/Notification/PingCluster',elasticquery.pingCluster);

//Notification Controller
app.all('/Notification/UpdateNotification', notificationController.UpdateNotification);
app.all('/Notification/DeleteNotification', notificationController.DeleteNotification);

console.log('Listening on port 3000...');
app.listen(3000, '127.0.0.1');
