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
//var moment = require('moment-timezone');
var elasticsearch = require("elasticsearch");
var jsonfile = require('jsonfile')

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

       file = dir+'/'+file;
       var stat = fs.statSync(file);

       if (stat && stat.isDirectory()) {
           results = results.concat(_getAllFilesFromFolder(file))
       } else results.push(file);

   });

   console.log('Get Notifiation File List');
   console.log(results);
   res.send(results);

   next();
};


// $scope.NotificationList = [
//   {NotifyID:"1",SearchID:"1",Threshold:"2",Period:""}//Period in minutes.
//   {NotifyID:"2",SearchID:"1",Threshold:"2",Period:""}
//   {NotifyID:"3",SearchID:"2",Threshold:"2",Period:""}
//   {NotifyID:"4",SearchID:"3",Threshold:"2",Period:""}
// ];
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
    var configfile = req.body.configfile;
    var contents = fs.readFileSync(configfile,'utf8');
    var dir = '/opt/API/Notifications/';

    var newNotification = {};

    newNotification.notificationName = req.body.notificationName;
    newNotification.selectedSearch = req.body.selectedSearch;
    newNotification.thresholdType = req.body.thresholdType;
    newNotification.thresholdCount = req.body.thresholdCount;
    newNotification.timeValue = req.body.timeValue;
    newNotification.timeFrame = req.body.timeFrame;
    newNotification.notificationDescription = req.body.notificationDescription;
    console.log(JSON.stringify(newNotification));

    jsonfile.writeFile(dir + '/' +  selectedSearch.notificationName + '.json', newNotification, function (err) {
      console.error(err);
    });
}
