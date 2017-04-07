//this file lists off the functions that will be avalible for the notification engine.


//Pull saved queries.
//Gets a list of saved queries and displays them by name.

var Q = require ('q');
var elasticsearch = require('elasticsearch');



// var searchquery =
// {
// //  http://192.168.1.104:9200/_search
//     "query": {
//         "match": {
//             "_type": "search"
//         }
//     }
// }

var elasticClient = new elasticsearch.Client({
    host: global.elastichost,
    sniffOnStart: true,
    apiVersion:'2.2',
    log: global.tracelevel
});

module.exports.pingCluster = function(req,res,next){
                                                    elasticClient.ping({
                                                      requestTimeout: 30000,

                                                      // undocumented params are appended to the query string
                                                      hello: "elasticsearch"
                                                    }, function (error) {
                                                      if (error) {
                                                        console.error('elasticsearch cluster is down!');
                                                        res.sendStatus(false);
                                                        next();
                                                      } else {
                                                        logEvent('All is well');
                                                        res.sendStatus(true);
                                                        next();
                                                      }
                                                    });
                                                  }



module.exports.ListSearches= function(req,res,next){
  var searchCount = getSearchCountLength();

  elasticClient.search({
    type:'search',
    'index-pattern': "/settings/objects/savedSearches/",
    "size":searchCount
  }).then(function (results) {

    var ii = 0, hits_in, hits_out = [];
    hits_in = (results.hits || {}).hits || [];
    var result=[];
    for(; ii < hits_in.length; ii++) {
        result.push(hits_in[ii]._source);
        logEvent(result);
    }
    res.sendStatus(JSON.stringify(result));
     logEvent(result);
  }, function (error) {
    console.trace(error.message);
  });
}


function getSearchCountLength(){
  elasticClient.count({
    type:'search',
    'index-pattern': "/settings/objects/savedSearches/"
  }).then(function (response) {
    var count = response.count;
    return count;

  }, function (error) {
    console.trace(error.message);
    return 25;//return 25 by default
  });
}


function getQuery(queryName){
  elasticClient.search({
    type:'search',
    name:queryName
  }).then(function (body) {
    var hits = body.hits.hits;
    return hits[0];

  }, function (error) {
    console.trace(error.message);
  });
}

module.exports.EvaluateSearch = function(req,res,next){
var queryName = req.body.queryName;
var timeFrame = req.body.timeFrame;
var query = getQueryString(queryName).then(function(result){
  runTimeFrameSearchInternal(result,timeFrame)
  .then(function(queryResult){
    res.sendStatus(queryResult);
    next();
  });
},function(err){
  logEvent(err.message);
  res.sendStatus(err.message);
  next();
});
}

//Call search by name
module.exports.CallQuery= function(req,res,next){
  var queryName = req.body.queryName;

   var query = getQueryString(queryName).then(function(result){
      runSearchInternal(result).then(function(innerresult){
        res.sendStatus(innerresult);
        next();
      },function(err)
    {
      logEvent(err.message);
    });
   });
}


function runSearchInternal(query,timeFrame)
{
  var deferred = Q.defer();
  var search = JSON.parse(query);

  var x = {
    index:search.index,
    searchType:"count",
    q:'@timestamp:(>now-24h) AND ' +search.query.query_string.query//,
  };

    //search.query
  elasticClient.search(x).then(
    function(result){
      var ii = 0, hits_in, hits_out = [];
      hits_in = (result.hits || {}).hits || [];
      deferred.resolve(result.hits);
      var result;
      for(; ii < hits_in.length; ii++) {
          result = JSON.stringify(hits_in[ii]._source.kibanaSavedObjectMeta.searchSourceJSON);
      }
      return result.hits;

    }, function (error) {
      console.trace(error.message);
      deferred.reject(error.message);
      return deferred.promise;
    }
  );
  return deferred.promise;
}

function runTimeFrameSearchInternal(query,timeFrame)
{
  var deferred = Q.defer();
  var search = JSON.parse(query);

  var x = {
    index:search.index,
    searchType:"count",
    q:'@timestamp:(>now-' + timeFrame + ') AND ' +search.query.query_string.query//,
  };

    //search.query
  elasticClient.search(x).then(
    function(result){
      var ii = 0, hits_in, hits_out = [];
      hits_in = (result.hits || {}).hits || [];
      deferred.resolve(result.hits);
      var result;
      for(; ii < hits_in.length; ii++) {
          result = JSON.stringify(hits_in[ii]._source.kibanaSavedObjectMeta.searchSourceJSON);
      }
      return result.hits;

    }, function (error) {
      console.trace(error.message);
      deferred.reject(error.message);
      return deferred.promise;
    }
  );
  return deferred.promise;
}


///Returns the query based on the query name
//Params: queryName
module.exports.getQuery = function (req,res,next){
  var queryName= req.body.queryName;
  elasticClient.search({
    type:'search',
    title: queryName
  }).then(function (result) {
    var ii = 0, hits_in, hits_out = [];

    hits_in = (result.hits || {}).hits || [];
    for(; ii < hits_in.length; ii++) {
     res.sendStatus(JSON.stringify(hits_in[ii]._source.kibanaSavedObjectMeta.searchSourceJSON));
    }
    if(hits_in.length<1)
    {
      res.sendStatus("No Restults");
    }
    next();
  }, function (error) {
    console.trace(error.message);
  });
}


module.exports.runSearch = function (req,res,next){
  var query_string = req.body.searchString;
  var search = JSON.parse(query_string);

  var x =   {
      index:search.index,
      query:search.query.query_string.query,
    searchType:"count"//,
    };
    logEvent(JSON.stringify(x));
  elasticClient.search(x
  ).then(function (result) {
    var ii = 0, hits_in, hits_out = [];

    hits_in = (result.hits || {}).hits || [];
    for(; ii < hits_in.length; ii++) {
     hits_out.push(hits_in[ii]._source);
    }
     res.sendStatus(JSON.stringify(hits_out));

    if(hits_in.length<1)
    {
      res.sendStatus("No Restults");
    }
    next();
  }, function (error) {
    console.trace(error.message);
  });
}


function getQueryString(queryName, callback)
{
  var deferred = Q.defer();
  elasticClient.search({
    type:'search',
    q: queryName
  }).then(function (result) {
    var ii = 0, hits_in, hits_out = [];

    hits_in = (result.hits || {}).hits || [];

    var result;
    for(; ii < hits_in.length; ii++) {
        result = hits_in[ii]._source.kibanaSavedObjectMeta.searchSourceJSON;
    }
    deferred.resolve(result);
    return result;
  }, function (error) {
    console.trace(error.message);
     deferred.reject(error.message);
    return error.message;
  });
  return deferred.promise;
}


module.exports.testQuery= function(req,res,next){
  elasticClient.search({
    type:'search',
    title:'BlaBla'
  }).then(function (body) {
    var hits = body.hits.hits;
res.send(hits[0]._source.kibanaSavedObjectMeta.searchSourceJSON);
var query = hits[0]._source.kibanaSavedObjectMeta.searchSourceJSON;
      elasticClient.search(query

    ).then(function (body) {
      var hits = body.hits.hits;
      res.send(hits);
    }, function (error) {
      console.trace(error.message);
    });

  }, function (error) {
    console.trace(error.message);
  });
}


  function logEvent(message){
                              if(global.tracelevel == 'debug'){
                                                                console.log(message);
                                                                }
                            }
