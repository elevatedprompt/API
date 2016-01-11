
var Resource = require('resourcejs');

module.exports = function(app, route) {

  var updateConfigFile = function(req,res,next)
  {
    console.log("Stopging Services.");
    var exec = require('child_process').exec;
    function puts(error, stdout, stderr) { sys.puts(stdout) }
    //TODO: update Service stop to stop allservices using the config file
    exec("service stop", console.log);

    console.log("Updating Config File " + res.resource.item.filename);
      var fs = require("fs");
      if(res.resource.item.active){
      fs.writeFile(res.resource.item.filename, res.resource.item.configuration,
        function (err) {
              if (err) throw err;
              console.log(res.resource.item.filename + ' Saved out to the directory.');
          });
        }
      else {
      //  fs.unlink(res.resource.item.filename, function (err) {
      //    if (err) throw err;
          console.log('successfully removed ' + res.resource.item.filename);
      //  });
      }
      console.log("Restarting Services.");
      exec("service start", console.log);
      //return middle ware.
      next();
  };
  // Setup the controller for REST;
  Resource(app, '', route, app.models.configfile).rest()
  .put({
    before: function (req, res, next) {
      console.log("Request");
      console.log(req.body.createddate);
      console.log(req.body.active);
      req.body.createddate = Date.now();

    //Always next after a before otherwsise the processing will stop.
    next();
    },
    after: function(req, res, next) {
    //display what has changed
      console.log("PUT was just called!" +   res.resource.item.filename);
      console.log("updating file");
      updateConfigFile(req, res, next);
    }})
  .patch({  after: function(req, res, next) {
      console.log("Patch was just called!");
    }})
  .post({  after: function(req, res, next) {
      console.log("Post was just called!");
    }})
  .get({  after: function(req, res, next) {
      console.log("Get was just called!");
    }})
    .delete({  after: function(req, res, next) {
        console.log("delete was just called!");
      }});

  // Return middleware.
  return function(req, res, next) {
    next();
  };

};
