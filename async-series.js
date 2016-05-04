/**
 * I need to run multiple tasks that depend on each other
 */

(function() {

  const async = require('async');
  const http = require('http');
  var userId;
  var userPosts = ''; // I don't get this but the async done function briefly sees this as undefined so I've had to initialize it as well (just to an empty string)

  async.series([

      function getUserId(callback){
        // let's simulate an async db call with setTimeout() - fake user id lookup basically
        setTimeout(function(){
          userId = 1;
          callback();
        }, 3000);

      },

      function getPostsByUser(callback){

        http.get('http://jsonplaceholder.typicode.com/posts?userId=' + userId, function(response){

          response.setEncoding('utf8');
          response.on('data', function(data){
            userPosts += data;
          });

          response.on('end', function(){
            callback();
          });

          response.on('error', function(){
            callback(error);
          });


        });
      }

    ],
    function done(err){
      if (err) {
        console.log(err);
      }
      else {
        // we got the users posts!
        console.log(userPosts);
      }
    }
  );

})();