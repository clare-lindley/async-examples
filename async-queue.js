/**
 * I need to perform an arbitrary set of asynchronous tasks
 * e.g. copy files from one S3 bucket to another.
 */

var async = require('async');

// Load the aws module
var aws = require('aws-sdk');

// Configure it (ENV vars are already set)
aws.config.update({region: 'eu-west-1'});

// Use it!
var s3 = new aws.S3();

var sourceBucket = '[your_source_bucket]';
var destinationBucket = '[your_destination_bucket]';
var listObjectsDone = false;


// Prepare queue

/**
 * async.queue takes 2 params - the task function and the request limit
 * and returns an object that you can push tasks to.
 *
 * The task function takes 2 params - the task and the async callback
 *
 */
var queue = async.queue(function(objectKey, callback) {

  var copySource = encodeURIComponent(sourceBucket + '/' + objectKey);
  var options = {
    Bucket: destinationBucket,
    CopySource: copySource,
    Key: objectKey
  };

  // here's the async bit - the s3 copyObject method
  s3.copyObject(options, function(err) {
    if (err) throw err;
    callback();
  });
}, 20); // Only allow 20 copy requests at a time


// Add function to call on queue.drain
queue.drain = function() {
  checkDone();
};


// Add items to the queue
function listObjects(marker) {

  var options = {
    Bucket: sourceBucket,
    Marker: marker,
    MaxKeys: 1000
  };

  s3.listObjects(options, function(err, result) {

    if (err) throw err;

    // 1. iterate over the bucket objects and add to the queue
    result.Contents.forEach(function(item){
      var objectName = item.Key;
      marker = objectName; // marker just gets set to the last item in the loop here.
      queue.push(objectName);
    })

    // 2. work out if we're done with the objects or we need to fetch another page
    if (result.IsTruncated == 'true') {
      listObjects(marker);
    } else {
      listObjectsDone = true;
      checkDone();
    }

  });

}

// Check when all items processed
function checkDone() {
  if (queue.length() == 0 && listObjectsDone) {
    console.log('Tada! All objects have been copied :)');
  }
}

// Kick it off!
listObjects(null);