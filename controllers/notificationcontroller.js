/*!
* Copyright(c) 2016 elevatedprompt
*
* Author: Colin Goss
 * @ngdoc function
 * @name EPStack API
 * @description
 */
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
var unirest = require('unirest');

module.exports = function(app, route){
  return function(req, res, next) {
    next();
  };
};

//return the list of notifications
module.exports.GetNotifications = function(req,res,next){
  logEvent('Get Notifiation File List');

  fs.readdirSync(global.notificationDirectory)
    .forEach(function(file) {
       file = file;
       var stat = fs.statSync(file);
       if (stat && stat.isDirectory()) {
           results = results.concat(_getAllFilesFromFolder(file))
       } else results.push(file);
   });

   res.sendStatus(results);
   next();
};


module.exports.GetAllNotifications = function (){
  var notifications = [];
  fs.readdirSync(global.notificationDirectory)
    .forEach(function(file) {
       var data = fs.readFileSync(file,'utf8');
       var obj = JSON.parse(data);
       notificaitons.push(obj);
   });

  return notifications;
}

//UpdateNotification
module.exports.UpdateNotification = function(req,res,next){
    logEvent('Save Notification');
    logEvent(req.body);

    var dir = global.notificationDirectory + req.body.notificationName;
    logEvent(global.notificationDirectory);
    logEvent(req.body.notificationName);
    var newNotification = {};
    logEvent(dir);
    newNotification.notificationName = req.body.notificationName;
    newNotification.selectedSearch = req.body.selectedSearch;
    newNotification.thresholdType = req.body.thresholdType;
    newNotification.thresholdCount = req.body.thresholdCount;

    newNotification.timeValue = req.body.timeValue;
    newNotification.timeFrame = req.body.timeFrame;
    newNotification.telegramChatId = req.body.telegramChatId;
    newNotification.notifyData = req.body.notifyData;
    newNotification.timeStamp = req.body.timeStamp;
    //Calculate the time interval in ms. 1000
    //m = 60,000 ms
    //h = 3600000
    //d = 86400000
    var multiplier = 300000; //default 5 min

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
    newNotification.checkFreq = req.body.checkFreq;

    logEvent("Saving Configuration to: " + dir);

    fs.writeFile(dir, JSON.stringify(newNotification), 'utf8', function (err) {
          logEvent(newNotification.enabled);
          if (newNotification.enabled=="true")
          {
              logEvent("Registering Notification");
             RegisterNotification(newNotification);
          }
          else {
            logEvent("UnRegistering Notification");
            UnregisterNotification(newNotification);
          }
      res.sendStatus('');
      next();
    });
}


//RegisterNotification
//Calls Notification API to register notification watcher
function RegisterNotification(notification){
  logEvent("Register Notification: " + notification);
  var methodCall = notificationService + 'RegisterNotification';

  unirest.post(methodCall)
  .headers({'Accept': 'application/json','Content-Type': 'application/json'})
  .send(JSON.stringify(notification))
  .end(function (response) {
    logEvent(response);
  });
}

//UnRegisterNotification
//Calls Notification API to unregister a notification watcher
function UnregisterNotification(notification){
  logEvent("Unregister Notification: " + notification);
  var methodCall = notificationService + 'UnRegisterNotification';

  logEvent(notification);
  unirest.post(methodCall)
  .headers({'Accept': 'application/json','Content-Type': 'application/json'})
  .send(JSON.stringify(notification))
  .end(function (response) {
    logEvent(response);
  });
}

//GetNotifications
//Returns a list of Notifications
module.exports.GetNotifications = function(req,res,next){
  var results = [];
  fs.readdirSync(global.notificationDirectory)
    .forEach(function(file) {
       file = global.notificationDirectory+'/'+file;
       var stat = fs.statSync(file);
       if (stat && stat.isDirectory()) {
           results = results.concat(_getAllFilesFromFolder(file))
       } else results.push(file);
   });

   res.send(results);
   next();
}


//Delete Notification
//Paramerters
//notificationName - name of the notification
module.exports.DeleteNotification = function(req,res,next){
  logEvent("Delete Notification")

  var notification = req.body.notificationName;
  var data = fs.readFileSync(notification,'utf8');
  var removedNotification = JSON.parse(data);

  UnregisterNotification(removedNotification);

  fs.unlink(notification, function (err) {
    if (err) throw err;
    logEvent(notification + ' Deleted');
  });
  res.sendStatus('');
  next();
};

  function logEvent(message){
                              if(global.tracelevel == 'debug'){
                                                                console.log(message);
                                                                }
                            }
