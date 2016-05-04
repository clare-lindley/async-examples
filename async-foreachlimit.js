/**
 * I need to iterate over a collection, perform an asynchronous task for each item,
 * but only let x tasks run at the same time, and when they're all done do something else.
 *
 * If you need to iterate over a collection and each task is dependent on the one before it
 * then use async.forEachSeries which does the same as async.forEachLimit with a concurrency of 1.
 *
 */


(function(){

  const async = require('async');
  const request = require('request');

  // generate a long list of dummy postIds - say we have 100 and we want to process them in batches of 10
  var postIds = [];
  for(var i=1; i<=100; i++){
    postIds.push(i);
  }
  var batchSize = 10;

  // note the second argument: batchSize sets how many tasks to run at the same time.
  async.forEachLimit(postIds, batchSize, function(postId, callback){ // The second argument (callback) is the "task callback" for a specific postId

      request.delete('http://jsonplaceholder.typicode.com/posts/' + postId, function(error, response, body){

        // check response status and call the callback for each succesful delete request
        // note http://jsonplaceholder.typicode.com says a DELETE request will return 204 but I'm getting 200
        if (!error && response.statusCode == 200) {
          callback();
        }

      })

    }, function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log(postIds.length + ' message(s) were deleted.');
      }
    }
  );
})();




