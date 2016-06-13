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

var express = require('express');
//var Resource = require('resourcejs');
var fs = require ('fs');
var exec = require('child_process').exec,child;
var moment = require('moment-timezone');
//var elasticsearch = require("elasticsearch");

module.exports = function(app, route){
  return function(req, res, next) {
    next();
  };
};

//GetNotification
//reads the contents of the notification file at (configfile)
module.exports.GetNotification = function(req,res,next){
  logEvent('Get Notification File:' + req.body);
  var configfile = req.body.configfile;
  var contents = fs.readFileSync(configfile,'utf8');

  logEvent(contents);
  res.send(contents);

  next();
};

//GetNotifications
//return the list of notifications
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

   logEvent('Get Notifiation File List');
   logEvent(results);
   res.send(results);

   next();
};

module.exports.ListSearches= function(req,res,next){
logEvent('Get List Of searches');

  //return a list of search types.
  elasticClient.search({
    type:'search'
  }).then(function (body) {
    var searches=[];
    for(var result in hits)
    {
      searches.push(result);
    }
    res.send(searches);
  }, function (error) {
    console.trace(error.message);
  });
}

//Updates Config file based on config file information.
//Paramerters
//conffilename - path to filename
//conffilecontent - content of the file
//servicetorestart - service that requires a restart
module.exports.UpdateNotification = function(req,res,next){

  logEvent("Update Notification File")
  logEvent(req.body);

  var configfilename = req.body.conffilename;
  var configcontent = req.body.conffilecontent;
  var servicetorestart = req.body.servicetorestart;

  fs.writeFileSync(configfilename, configcontent, 'utf8', function (err) {
    if (err) throw err;
    logEvent('It\'s saved!');
  });
  next();
};


//Delete Config file
//Paramerters
//conffilename - path to filename
module.exports.DeleteNotification = function(req,res,next){
  logEvent("Delete Notification File")
  logEvent(req.body);

  var configfilename = req.body.conffilename;

  fs.unlink(configfilename, function (err) {
    if (err) throw err;
    logEvent(configfilename + ' It\'s gone!');
  });
  next();
};

  function logEvent(message){
                              if(global.tracelevel == 'debug'){
                                                                console.log(message);
                                                                }
                            }
