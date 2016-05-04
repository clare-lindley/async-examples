/**
 * I need to run multiple tasks that don't depend on each other
 */

const async = require('async');
const fs = require('fs');
const http = require('http');



async.parallel([
    // task 1: get some posts from this fake API
    function callAPI(callback){
      http.get('http://jsonplaceholder.typicode.com/photos', function(response){

        response.setEncoding('utf8');

        // whenever we get data we need to save it to the body
        var body = '';
        response.on('data', function(data){
          body += data;
        });

        response.on('end', function(){
          console.log('got data');
          callback();
        });

        response.on('error', function(){
          console.log('API CALL ERROR');
          callback(error);
        });


      })
    },

    // task 2: clear this cached file
    function deleteCachedFile(callback){
      fs.unlink('./cachefile.txt', function(err){
        if(err){
          console.log('deleteCachedFile', err);
          return callback(err);
        }
        else {
          console.log('cachefile deleted');
          callback();
        }
      });
    }

  ],
  function done(err){
    if (err) {
      console.log('done', err);
    }
    else {
      // we can do something now we have ALL THE THINGS
      console.log('GOT ALL THE THINGS!');
    }
  }
);
