
var Resource = require('resourcejs');
var fs = require ('fs');


module.exports =   function(app, route){
  var getConfigFile = function(location,req,res,next){
      fs.readFile(location, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        res.json({
          fileLocation : location,
          content: data
        });
      });

  };
  var saveConfigFile = function(location,req,res,next){

    fs.writeFile(location, req.body.content,
           function (err) {
                 if (err) throw err;

            console.log(location + ' Saved out to the directory.');
             });
  };


  Resource(app, '', route, app.models.kibana)
  .index({
    before: function (req, res, next) {
      console.log("Requested KibanaConfig");
      console.log(req.body);
  getConfigFile('j:/Test/ConfigFile.conf',req,res,next);
    //Always next after a before otherwsise the processing will stop.
  //  next();
    },
    after: function(req, res, next) {
    //display what has changed
      console.log("Kibana PUT was just called!" +   res.resource.item.filename);
      console.log("updating file");
      updateConfigFile('j:/Test/ConfigFile.conf',req, res, next);
    }})
  .post({
    before: function (req, res, next) {
      console.log("Request");
      console.log(req.body);
        updateConfigFile('j:/Test/ConfigFile.conf',req, res, next);
      //no need to continue so stop processing

    },
    after: function(req, res, next) {

      console.log("PUT was just called!" +   res.resource.item.filename);
      console.log("updating file");
    }});
  // Setup the controller for REST;
  return function(req, res, next) {

    next();
  };

};
