/*!
* Copyright(c) 2016 elevatedprompt
*
* Author: Colin Goss
 * @ngdoc function
 * @name EPStack API
 * @description
 */
 /*
EPSystem controller

Methods
GetConfFiles - Gets Config File
GetServiceStatus - returns the status of a service by name.
RestartAllServices - Restarts all services
UpdateConfigFiles - Updates Config Files
GetTimeZone - Returns the System time.

Update Cron Jobs - Updates logstash delete and close index cron settings
*/

var fs = require ('fs');
var exec = require('child_process').exec,child;
var moment = require('moment-timezone');

module.exports =   function(app, route){
  return function(req, res, next) {
    next();
  };

};

//GetConfFile
//reads the contents of the config file at (configfile)
module.exports.GetConfFile = function(req,res,next)
{
  logEvent('Get Config File');
  logEvent(req.body);
  var configfile = req.body.configfile;
  var contents = fs.readFileSync(configfile,'utf8');

  logEvent(contents);
  res.send(contents);
  next();
};

//GetLogstashConfigDirectoryListing
//Returns a list of files in the logstash config directory
module.exports.GetLogstashConfigDirectoryListing = function(req,res,next)
{
  var results = [];
   logEvent('Get Logstash File List');
  fs.readdirSync(global.logstashConfig)
    .forEach(function(file) {
       file = global.logstashConfig+'/'+file;
       var stat = fs.statSync(file);
       logEvent(file);
       logEvent(stat);
       if (stat && stat.isDirectory()) {
           results = results.concat(_getAllFilesFromFolder(file))
       } else results.push(file);
   });


   logEvent(results);
   res.send(results);
   next();
};

//GetElasticConfigDirectoryListing
//Returns a list of Elastic Config files
module.exports.GetElasticConfigDirectoryListing = function(req,res,next)
{
  var results = [];
logEvent('Get ElasticSearch File List');
  fs.readdirSync(global.elasticsearchLocation)
    .forEach(function(file) {

       file = global.elasticsearchLocation+'/'+file;
       var stat = fs.statSync(file);
       logEvent(file);
       logEvent(stat);
       logEvent(stat.isDirectory());
       if (stat.isDirectory()!=true) {
           results = results.concat(file)
       }
   });


    logEvent(results);
   res.send(results);
   next();
};

module.exports.GetCronJobDirectory = function(req,res,next)
{
  var results = [];
  logEvent('Get cron folder File List');
  fs.readdirSync(global.cronJobDirectory)
    .forEach(function(file) {

       file = global.cronJobDirectory+'/'+file;
       var stat = fs.statSync(file);
       logEvent(file);
       logEvent(stat);
       logEvent(stat.isDirectory());
       if (stat && stat.isDirectory()) {
           results = results.concat(file)
       } else results.push(file);

   });

    logEvent('Get cron folder File List');
    logEvent(results);
   res.send(results);
   next();
};

//GetServiceStatus (Gets the status of the service by name)
module.exports.GetServiceStatus = function(req,res,next)
{
  logEvent('Get Service Status:' + req.body);

  var servicename = req.body.servicename;

  var result = exec("service " + servicename + " status", function (error, stdout, stderr,res, next) {
    if (error !== null) {
      logEvent('exec Get Service Status ('+servicename+') error: ' + error);
    }
    return stdout;
  })

  result.stdout.on('data', function (data) {
    logEvent('Got service status: ' + data);
   res.send(data);
 });
};

//IsServiceRunning
//Returns the service status
module.exports.IsServiceRunning = function(req,res,next)
{
  logEvent('Is Service Running' + req.body);

  var servicename = req.body.servicename;

  var result = exec("service " + servicename + " status", function (error, stdout, stderr,res, next) {
    if (error !== null) {
      logEvent('exec IsServiceRunning('+servicename+') error: ' + error);
    }
    return stdout;
  })

  result.stdout.on('data', function (data) {

    var stopped = "stopped";
    var notrunning = "not running";
    var running = "is running";
    var pidFile = "pid file exists";
    var ubuntu16Active = 'active (running)';
    var ubuntu16Inactive = 'inactive (dead)';
    var str = data.toString();
    logEvent("Output from Service Call");
    logEvent(str);
    if(str.match(stopped)){
      res.send(false);
      logEvent(data + ' service stopped');
    }
    if(str.match(ubuntu16Inactive)){
      res.send(false);
      logEvent(data + ' service stopped');
    }
    if(str.match(ubuntu16Active)){
      res.send(true);
      logEvent(data + ' service running');
    }
    if(str.match(notrunning)){
      res.send(false);
      logEvent(data + ' service stopped');
    }

    if(str.match(running)){
      res.send(true);
      logEvent(data + ' service running');
    }

    if(str.match(pidFile)){
      res.send(true);
      logEvent(data + ' pid file exists. (Stop to Reset)');
    }
 });
};

//StopService
//Executes a Stop Service Request
module.exports.StopService = function(req,res,next)
{
  logEvent('Stop Service: ' + req.body);

  var servicename = req.body.servicename;

  var result = exec("service " + servicename + " stop", function (error, stdout, stderr,res, next) {
    logEvent('stdout: ' + stdout);
    logEvent('stderr: ' + stderr);
    if (error !== null) {
      logEvent('exec stop service error: ' + stderr);
    }
    return stdout;
  })

   var output = '';
   result.stdout.on('data', function (data) {
     logEvent(data + ' Stop service is complete');
    output+= data;
  });
  result.on('close', function (data,status) {
     logEvent(data + ' Stop service close');
    res.sendStatus(output);
  });
   result.stderr.on('error', function (error) {
     logEvent(data + ' Stop service error');
    res.send(error);
  });
};


//StartService (Gets the status of the service by name)
module.exports.StartService = function(req,res,next)
{
  logEvent('Start Service:' + req.body);

  var servicename = req.body.servicename;
  var output = '';

  var result = exec("service " + servicename + " start", function (error, stdout, stderr,res, next) {
    if (error !== null) {
      logEvent('exec Start Service ' + servicename + 'error: ' + stderr);
    }
    return stdout;
  })


  result.stdout.on('data', function (data) {
   output+= data;
 });
  result.on('close', function (data,status) {
    logEvent('start service close');
    res.sendStatus(output);
 });
 result.stderr.on('error', function (error) {
   logEvent('start service error, attempting restart');
   var result = exec("service " + servicename + " restart", function (error, stdout, stderr,res, next) {
     logEvent('stdout: ' + stdout);
     logEvent('stderr: ' + stderr);
     if (error !== null) {
       logEvent('exec Restart Service ' + servicename + 'error: ' + stderr);
     }
     return stdout;
   })
  res.send(error);
});
};

//Updates Config file based on config file information.
//Paramerters
//conffilename - path to filename
//conffilecontent - content of the file
//servicetorestart - service that requires a restart
module.exports.UpdateConfFile = function(req,res,next)
{

  logEvent("Update Config File:" + req.body);

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
module.exports.DeleteConfFile = function(req,res,next)
{
  logEvent("Delete Config File:" + req.body);

  var configfilename = req.body.conffilename;

  fs.unlink(configfilename, function (err) {
    if (err) throw err;
    logEvent(configfilename + ' It\'s gone!');
  });
  next();
};


//Validate the Logstash config file
//Paramerters
//conffilename - path to filename
module.exports.ValidateLogstashFile = function(req,res,next)
{
  logEvent("Validate Logstash File:" + req.body);

  var output = '';
  var validationResponse= {};
  validationResponse.IsValid = false;
  validationResponse.Message ="";
  var configfilename = req.body.conffilename;

  var result = exec("/opt/logstash/bin/logstash --configtest -f  " + configfilename, function (error, stdout, stderr,res, next) {
    if (error !== null) {
      logEvent('exec config test file ' + configfilename + 'error: ' + stderr);
    }
    return stdout;
  })

  result.stdout.on('data', function (data) {
   output+= data;
  });
  result.on('close', function (data,status) {
    logEvent('Logstash Config File test close');
    var configOK = "Configuration OK";

    var str = data.toString();
    if(str.match(configOK)){
      validationResponse.IsValid = true;
    }
    else{
      validationResponse.IsValid = false;
    }
    validationResponse.Message = output;
    res.sendStatus(JSON.stringify(validationResponse));
  });
  result.stderr.on('error', function (error) {
     logEvent('Logstash Config File error: ' + error);
     validationResponse.IsValid = false;
     validationResponse.Message = error;
  });
};

//GetTimeZone
//returns the system time.
module.exports.GetTimeZone = function(req,res,next)
{
  try {
    logEvent('Get Timezone');
    fs.readlink("/etc/localtime", function(err, linkString){
      try{
      logEvent(linkString);
      linkString = linkString.replace('/usr/share/zoneinfo/','');
      res.send(linkString);
    }
    catch(ex){
      logEvent(ex);
      next();
    }
  });
  } catch (e) {
    callback(e);
  } finally {
  }
}

//Update timezone
//unlink /etc/localtime
//ln -s /usr/share/zoneinfo/ /etc/localtime
module.exports.UpdateTimeZone = function(req,res,next)
{
  logEvent("Updating Timezone to :" + req.body.timezone);

  var timezone = req.body.timezone;
  //unlink /etc/localtime
  //ln -s /usr/share/zoneinfo/Etc/GMT+6 /etc/localtime
  logEvent("unlink /etc/localtime ");
  var unlinkTimezone = exec("unlink /etc/localtime ", function (error, stdout, stderr) {
    if (error !== null) {
      logEvent('exec unlink error: ' + stderr);
    }
    return stdout;
  })
  var output = '';

  unlinkTimezone.on('close', function (data,status) {
    logEvent("ln -s /usr/share/zoneinfo/" + timezone +" /etc/localtime");
    var newTimezone = exec("ln -s /usr/share/zoneinfo/" + timezone +" /etc/localtime", function (error, stdout, stderr) {
      if (error !== null) {
        logEvent('exec link error: ' + stderr);
      }
      return stdout;
    });
    newTimezone.on('close', function (data,status) {
      logEvent('Timezone Set to ' + timezone)
      res.sendStatus(output);
    });
    newTimezone.stderr.on('error', function (error) {
     logEvent('Set Timezone Error');
     res.send(error);
    });
 });

 unlinkTimezone.stderr.on('error', function (error) {
    logEvent('Unlink Timezone Error');
    res.send(error);
  });
  moment.tz.setDefault(timezone);
};

//ListUsers
//ListUsers returns a list of users from the htpasswd file.
module.exports.ListUsers = function(req,res,next)
{
  logEvent("Getting Users");
  //htpasswd to manage the password file
  logEvent("cat /etc/nginx/conf.d/kibana.htpasswd ");
    var listUsers = exec("cat /etc/nginx/conf.d/kibana.htpasswd ", function (error, stdout, stderr) {
      logEvent('stdout: ' + stdout);
      logEvent('stderr: ' + stderr);
      if (error !== null) {
        logEvent('exec cat htpasswd error: ' + stderr);
      }
      var arr = stdout.toString().split('\n');
      var userArray = [];
      arr.forEach(extractUser);

      function extractUser(element, index, array) {
        var user = element.toString().split(':');
        logEvent(user[0]);
        if(user[0]!="")
          userArray.push(user[0]);
      }

      res.sendStatus(JSON.stringify(userArray));
    });
    listUsers.on('close', function (data,status) {
      logEvent('cat httpasswd:')
    });
    listUsers.stderr.on('error', function (error) {
     logEvent('cat htpassword Error:' + error);
     res.send(error);
    });
};

//UpdateUser
//updates a user password or if it does not exist it creates a new once
module.exports.UpdateUser = function(req,res,next)
{
  logEvent("Updating User");
  logEvent(req.body.User);
  var user = req.body.User;
  var pass = req.body.passwd;

  //htpasswd to manage the password file
  logEvent("htpasswd -b /etc/nginx/conf.d/kibana.htpasswd " + user);
    var updateUserCall = exec("htpasswd -b /etc/nginx/conf.d/kibana.htpasswd " + user + " " + pass, function (error, stdout, stderr) {
      logEvent('stdout: ' + stdout);
      logEvent('stderr: ' + stderr);
      if (error !== null) {
        logEvent('exec update htpasswd error: ' + stderr);
      }
      return stdout;
    });
    updateUserCall.on('close', function (data,status) {
      logEvent('Updated password file for user:  ' + user)
      res.sendStatus(data);
    });
    updateUserCall.stderr.on('error', function (error) {
     logEvent('Update htpassword user: ' + user + ' error: '+ error);
     res.send(error);
    });

 };

//Delete User
 module.exports.DeleteUser = function(req,res,next)
 {
   logEvent("Delete User");
   logEvent(req.body.User);
   var user = req.body.User;

   //htpasswd to manage the password file
   logEvent("htpasswd -D /etc/nginx/conf.d/kibana.htpasswd " + user);
   var deleteUserCall = exec("htpasswd -D /etc/nginx/conf.d/kibana.htpasswd " + user , function (error, stdout, stderr) {
     logEvent('stdout: ' + stdout);
     logEvent('stderr: ' + stderr);
     if (error !== null) {
       logEvent('exec Delete User error: ' + stderr);
     }
     return stdout;
   });
   deleteUserCall.on('close', function (data,status) {
     logEvent('User Delete ' + user)
     res.sendStatus(data);
   });
   deleteUserCall.stderr.on('error', function (error) {
    logEvent('Delete User :' + user + ' error: ' + error);
    res.send(error);
   });
  };

  function logEvent(message){
                              if(global.tracelevel == 'debug'){
                                                                console.log(message);
                                                                }
                            }
