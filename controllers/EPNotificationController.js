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
  // Setup the controller for REST;
  return function(req, res, next) {
    next();
  };
};

//GetNotification
//reads the contents of the notification file at (configfile)
module.exports.GetNotification = function(req,res,next)
{
  console.log('Get Notification File:' + req.body);
  var configfile = req.body.configfile;
  var contents = fs.readFileSync(configfile,'utf8');

  console.log(contents);
  res.send(contents);

  next();
};

//GetNotifications
//return the list of notifications
module.exports.GetNotifications = function(req,res,next)
{
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

   console.log('Get Notifiation File List');
   console.log(results);
   res.send(results);

   next();
};

module.exports.ListSearches= function(req,res,next){
console.log('Get List Of searches');

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

// res.send(hits[0]._source.kibanaSavedObjectMeta.searchSourceJSON);
// var query = hits[0]._source.kibanaSavedObjectMeta.searchSourceJSON;


//Updates Config file based on config file information.
//Paramerters
//conffilename - path to filename
//conffilecontent - content of the file
//servicetorestart - service that requires a restart
module.exports.UpdateNotification = function(req,res,next)
{

  console.log("Update Notification File")
  console.log(req.body);

  var configfilename = req.body.conffilename;
  var configcontent = req.body.conffilecontent;
  var servicetorestart = req.body.servicetorestart;

  //TODO: restrict to specific file types and configuration paths
  //TODO: identify if service needs reset.

  fs.writeFileSync(configfilename, configcontent, 'utf8', function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
  next();
};


//Delete Config file
//Paramerters
//conffilename - path to filename
module.exports.DeleteNotification = function(req,res,next)
{
  console.log("Delete Notification File")
  console.log(req.body);

  var configfilename = req.body.conffilename;

  fs.unlink(configfilename, function (err) {
    if (err) throw err;
    console.log(configfilename + ' It\'s gone!');
  });
  //Consider writing a backup...
//  fs.writeFileSync(configfilename, configcontent, 'utf8', function (err) {
//    if (err) throw err;
//    console.log(configfilename + ' It\'s gone!');
//  });
  next();
};
