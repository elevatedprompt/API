/*
System controller

Methods
GetConfFiles - Gets Config File
GetServiceStatus - returns the status of a service by name.
RestartAllServices - Restarts all services
UpdateConfigFiles - Updates Config Files
GetTimeZone - Returns the System time.

Update Cron Jobs - Updates logstash delete and close index cron settings
*/
var Resource = require('resourcejs');
var fs = require ('fs');
//var sys = require('sys');
var exec = require('child_process').exec,child;
var moment = require('moment-timezone');

module.exports =   function(app, route){

//  Resource(app, '', route, app.models.movie).rest();

  // Setup the controller for REST;
  return function(req, res, next) {

    next();
  };

};


//reads the contents of the config file at (configfile)
module.exports.GetConfFile = function(req,res,next)
{

  console.log('Get Config File');
  console.log(req.body);
  var configfile = req.body.configfile;
  var contents = fs.readFileSync(configfile,'utf8');

  console.log(contents);
  res.send(contents);

  next();

};

module.exports.GetLogstashConfigDirectoryListing = function(req,res,next)
{
  var results = [];
  var dir = '/etc/logstash/conf.d/';
  fs.readdirSync(dir)
    .forEach(function(file) {

       file = dir+'/'+file;
       var stat = fs.statSync(file);

       if (stat && stat.isDirectory()) {
           results = results.concat(_getAllFilesFromFolder(file))
       } else results.push(file);

   });

   console.log('Get Logstash File List');
   console.log(results);
   res.send(results);

   next();

};


module.exports.GetElasticConfigDirectoryListing = function(req,res,next)
{
  var results = [];
  var dir = '/etc/elasticsearch/';
  fs.readdirSync(dir)
    .forEach(function(file) {

       file = dir+'/'+file;
       var stat = fs.statSync(file);

       if (stat && stat.isDirectory()) {
           results = results.concat(_getAllFilesFromFolder(file))
       } else results.push(file);

   });

   console.log('Get Logstash File List');
   console.log(results);
   res.send(results);

   next();
};

module.exports.GetCronJobDirectory = function(req,res,next)
{
  var results = [];
  var dir = '/var/spool/cron/';
  fs.readdirSync(dir)
    .forEach(function(file) {

       file = dir+'/'+file;
       var stat = fs.statSync(file);

       if (stat && stat.isDirectory()) {
           results = results.concat(_getAllFilesFromFolder(file))
       } else results.push(file);

   });

   console.log('Get cron folder File List');
   console.log(results);
   res.send(results);
   next();
};


//GetServiceStatus (Gets the status of the service by name)
module.exports.GetServiceStatus = function(req,res,next)
{
  console.log("Get Service Status")
  console.log(req.body);

  var servicename = req.body.servicename;

  var result = exec("service " + servicename + " status", function (error, stdout, stderr,res, next) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    return stdout;
  })

  result.stdout.on('data', function (data) {
   res.send(data);
 });
};

module.exports.IsServiceRunning = function(req,res,next)
{
  console.log("Is Service Running")
  console.log(req.body);

  var servicename = req.body.servicename;

  var result = exec("service " + servicename + " status", function (error, stdout, stderr,res, next) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    return stdout;
  })

  result.stdout.on('data', function (data) {

    var stopped = "stopped";
    var notrunning = "not running";
    var running = "is running";

    var str = data.toString();
    if(str.match(stopped)){
      res.send(false);
    }

    if(str.match(notrunning)){
      res.send(false);
    }

    if(str.match(running)){
      res.send(true);
    }
 });
};
//StopService (Gets the status of the service by name)
module.exports.StopService = function(req,res,next)
{
  console.log("Stop Service")
  console.log(req.body);

  var servicename = req.body.servicename;

  var result = exec("service " + servicename + " stop", function (error, stdout, stderr,res, next) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + stderr);
    }
    return stdout;
  })


 var output = '';
 result.stdout.on('data', function (data) {
  output+= data;
});
result.on('close', function (data,status) {
  console.log('Stop service close');
  res.sendStatus(output);
});
 result.stderr.on('error', function (error) {
   console.log('Stop service error');
  res.send(error);
});
};

//StartService (Gets the status of the service by name)
module.exports.StartService = function(req,res,next)
{
  console.log("Start Service")
  console.log(req.body);

  var servicename = req.body.servicename;

  var result = exec("service " + servicename + " start", function (error, stdout, stderr,res, next) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + stderr);
    }
    return stdout;
  })
  var output = '';
  result.stdout.on('data', function (data) {
   output+= data;
 });
  result.on('close', function (data,status) {
    console.log('start service close');
    res.sendStatus(output);
 });
 result.stderr.on('error', function (error) {
   console.log('start service error');
  res.send(error);
});
};


///RestartAllServices (Restarts all services for EP Stack)
module.exports.RestartAllServices = function(req,res,next)
{
  var sys = require('sys')
  var exec = require('child_process').exec;
  function puts(error, stdout, stderr) { sys.puts(stdout) }

  //TODO: Identify services that need restart.
  exec("dir", console.log);

  res.send('restarting services');
  next();
};


//Updates Config file based on config file information.
//Paramerters
//conffilename - path to filename
//conffilecontent - content of the file
//servicetorestart - service that requires a restart
module.exports.UpdateConfFile = function(req,res,next)
{

  console.log("Update Config File")
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

  //TODO: check for service to restart. (future)

//  var configControl = require('./ConfigFileController');
//  var configfiles = configControl.getList().$object;

  next();
};


//returns the system time.
module.exports.GetTimeZone = function(req,res,next)
{
  console.log('Get Timezone');
  console.log(moment.tz.guess());
  res.send(moment.tz.guess());
}

//Update timezone
//unlink /etc/localtime
//ln -s /usr/share/zoneinfo/ /etc/localtime
module.exports.UpdateTimeZone = function(req,res,next)
{

  console.log("Updating Timezone to ");
  console.log(req.body.timezone);
  var timezone = req.body.timezone;
  //unlink /etc/localtime
  //ln -s /usr/share/zoneinfo/Etc/GMT+6 /etc/localtime

  var unlinkTimezone = exec("unlink /etc/localtime ", function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + stderr);
    }
    return stdout;
  })
  var output = '';

  unlinkTimezone.on('close', function (data,status) {

    var newTimezone = exec("ln -s /usr/share/zoneinfo/" + timezone +" /etc/localtime", function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + stderr);
      }
      return stdout;
    });
    newTimezone.on('close', function (data,status) {
      res.sendStatus(output);
    });
    newTimezone.stderr.on('error', function (error) {
     console.log('Set Timezone Error');
     res.send(error);
    });

 });

 unlinkTimezone.stderr.on('error', function (error) {
   console.log('Unlink Timezone Error');
    res.send(error);
  });

};
