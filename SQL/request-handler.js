var db = require('./db');
var serverHelpers = require('./server-helpers');
var Promise = require('bluebird');


// wham! magic.
var parseData = Promise.promisify(serverHelpers.collectData);
var saveMessage = Promise.promisify(db.saveMessage);
var saveUser = Promise.promisify(db.saveUser);
var findMessages = Promise.promisify(db.findAllMessages);
var findUser = Promise.promisify(db.findUser);


exports.postMessage = function(req, res) {
  // declare this variable so we can retain access to it throughout the entire promise chain.
  var message;

// kick off the promise chain.
  parseData(req).then(
    function(msg) {
      message = msg;
      return findUser({username: msg.username});
    }
  ).then(
    function(results) {
      // the code path diverges
      if (!results.length) {
        return saveUser(message.username);
      }

      // we need to keep the promise chain going, so we create a new promise and
      // immediately resolve it--this is synchronous code masquerading as async code!
      return new Promise(
        function(resolve, reject) {
          resolve(results);
        }
      );
    }
  ).then(
    function(results) {
      var userid;

      // handle both paths
      if (Array.isArray(results)){
        userid = results[0].id;
      } else {
        userid = results.insertId;
      }

      var chat = {
        text  : message.text,
        userid : userid,
        roomname : message.roomname
      }

      return saveMessage(chat);
    }
  ).then(
    function() {
      serverHelpers.sendResponse(res, message);
    }
  )
  //TODO: add error handling using `.catch`
};

exports.getMessages = function(req, res) {
  findMessages().then(
    function(messages) {
      serverHelpers.sendResponse(res, messages);
    }
  );
};

exports.sendOptionsResponse = function(req, res) {
  serverHelpers.sendResponse(res, null);
};
