/**
 * I need to iterate over a collection, perform an asynchronous task for each item, and when they're all done do something else
 *
 * e.g. Delete a list of posts
 *
 */


(function(){

  const async = require('async');
  const request = require('request');

  var postIds = [1,2,3,4,5,6,7,8,9,10];

  async.forEach(postIds, function(postId, callback){ // The second argument (callback) is the "task callback" for a specific postId

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