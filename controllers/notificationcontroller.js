/*
EPNotificationController controller

Methods
List Notifications
RegisterNotifications
UpdateNotification
EvaluateNotification
*/

var Resource = require('resourcejs');
var fs = require ('fs');
var elasticsearch = require("elasticsearch");
var jsonfile = require('jsonfile')

var notificationService  = 'http://127.0.0.1:3003/';

module.exports = function(app, route){
  // Setup the controller for REST;
  return function(req, res, next) {
    next();
  };
};

//return the list of notifications
module.exports.GetNotifications = function(req,res,next)
{
  var dir = '/opt/API/Notifications/';
  fs.readdirSync(dir)
    .forEach(function(file) {
       // dir+'/'+
       file = file;
       var stat = fs.statSync(file);
       if (stat && stat.isDirectory()) {
           results = results.concat(_getAllFilesFromFolder(file))
       } else results.push(file);
   });

   console.log('Get Notifiation File List');
   console.log(results);
   res.sendStatus(results);

   next();
};


module.exports.GetAllNotifications = function ()
{
  var notifications = [];
  var dir = '/opt/API/Notifications/';
  fs.readdirSync(dir)
    .forEach(function(file) {
       var data = fs.readFileSync(file,'utf8');
       var obj = JSON.parse(data);
       notificaitons.push(obj);
   });

  return notifications;
}

module.exports.UpdateNotification = function(req,res,next)
{
    console.log('Save Notification');
    console.log(req.body);
  //  var configfile = req.body.configfile;
  //  var contents = fs.readFileSync(configfile,'utf8');
    var dir = '/opt/API/Notifications/' + req.body.notificationName;
    console.log("File to Write");
    console.log(dir);
    var newNotification = {};

    newNotification.notificationName = req.body.notificationName;
    newNotification.selectedSearch = req.body.selectedSearch;
    newNotification.thresholdType = req.body.thresholdType;
    newNotification.thresholdCount = req.body.thresholdCount;

    newNotification.timeValue = req.body.timeValue;
    newNotification.timeFrame = req.body.timeFrame;
    //Calculate the time interval in ms. 1000
    //m = 60,000 ms
    //h = 3600000
    //d = 86400000
    var multiplier = 300000; //default 5 min sec

    switch(newNotification.timeFrame)
    {
      case "m":
      multiplier = 60000;
      break;
      case "h":
      multiplier = 3600000;
      break;
      case "d":
      multiplier = 86400000;
      break;
    }

    newNotification.interval = newNotification.timeValue * multiplier;
    newNotification.notificationDescription = req.body.notificationDescription;
    newNotification.enabled = req.body.enabled;
    newNotification.notifyEmail = req.body.notifyEmail;

    console.log(JSON.stringify(newNotification));

    console.log("Saving Configuration to: " + dir);
    jsonfile.writeFile(dir , newNotification, function (err) {
      console.error(err);
    });

    //A save has happened, refresh the notification
    UnregisterNotification(newNotification.notificationName);
    //IF the notification is enabled register it to run
    if (newNotification.enabled)
    {
      RegisterNotification(newNotification.notificationName);
    }
    next();
}


function RegisterNotification(notification){
  var methodCall = notificationService + 'RegisterNotification';
var Client = require('node-rest-client').Client;
  var client = new Client();

  var config = {headers:{
    "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
    }};

  var data = "notificationName="+ encodeURIComponent(notification.notificationName);
  var args = {
  	path: { "id": 120 },
  	parameters: { arg1: "hello", arg2: "world" },
  	headers: {   "Content-type": "application/x-www-form-urlencoded; charset=utf-8" },
  	data: "<xml><arg1>hello</arg1><arg2>world</arg2></xml>",
  	requestConfig: {
  		timeout: 1000, //request timeout in milliseconds
  		noDelay: true, //Enable/disable the Nagle algorithm
  		keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
  		keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
  	},
  	responseConfig: {
  		timeout: 1000 //response timeout
  	}
  };


  var req =client.post(methodCall + "?" + data,args, function (data, response) {
      console.log(data)  ;
      });
  req.on('requestTimeout', function (req) {
  	console.log('request has expired');
  	req.abort();
  });

  req.on('responseTimeout', function (res) {
  	console.log('response has expired');

  });

  //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
  req.on('error', function (err) {
  	console.log('request error', err);
  });
}

function UnregisterNotification(notificationName){
  var methodCall = notificationService + 'UnRegisterNotification';
  var Client = require('node-rest-client').Client;
  var client = new Client();
  var config = {headers:{
    "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
    }};
    var data = "notificationName="+ encodeURIComponent(notificationName);
    var args = {
    	path: { "id": 120 },
    	parameters: { arg1: "hello", arg2: "world" },
    	headers: {   "Content-type": "application/x-www-form-urlencoded; charset=utf-8" },
    	data: "<xml><arg1>hello</arg1><arg2>world</arg2></xml>",
    	requestConfig: {
    		timeout: 1000, //request timeout in milliseconds
    		noDelay: true, //Enable/disable the Nagle algorithm
    		keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
    		keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
    	},
    	responseConfig: {
    		timeout: 1000 //response timeout
    	}
    };

    var req =client.post(methodCall + "?" + data,args, function (data, response) {
        console.log(data);
         $scope.avalibleSearches=data;
      });

      req.on('requestTimeout', function (req) {
      	console.log('request has expired');
      	req.abort();
      });

      req.on('responseTimeout', function (res) {
      	console.log('response has expired');

      });

      //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
      req.on('error', function (err) {
      	console.log('request error', err);
      });
}

module.exports.GetNotifications = function(req,res,next){
  var results = [];
  var dir = '/opt/API/Notifications/';
  fs.readdirSync(dir)
    .forEach(function(file) {

       file = dir+'/'+file;
       var stat = fs.statSync(file);

       if (stat && stat.isDirectory()) {
           results = results.concat(_getAllFilesFromFolder(file))
       } else results.push(file);
   });

   console.log('Get notification folder File List');
   console.log(results);
   res.send(results);
   next();
}


//Delete Notification
//Paramerters
//notificationName - name of the notification
module.exports.DeleteConfFile = function(req,res,next)
{
  console.log("Delete Notification")
  console.log(req.body);

  var notification = '/opt/API/Notifications/' + req.body.notificationName;

//  notificationEngine.UnregisterNotification(req.body.notificationName);
  fs.unlink(notification, function (err) {
    if (err) throw err;
    console.log(notification + ' It\'s gone!');
  });
  next();
};
