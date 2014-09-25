var db = require('./db');
var serverHelpers = require('./server-helpers');

var User = db.User;
var Message = db.Message;


// the infamous callback pyramid.
// would using promises significantly increase code readability?
// Hat tip to Vin for figuring out the .setUser method.

exports.postMessage = function(req, res) {
  serverHelpers.collectData(req, function(message){

    User.findOrCreate({username: message.username})
    .success(function(user){

      Message.create(message)
      .success(function(message){

        message.setUser(user)
        .success(function(message))

          serverHelpers.sendResponse(res, message);
        });
      });
    });
  });
};



exports.getMessages = function(req, res) {
  // eager loading
  Message.findAll({ include: [User] })
  .success(function(messages, error){

      serverHelpers.sendResponse(res, messages);
    }
  );
};


exports.sendOptionsResponse = function(req, res) {
  serverHelpers.sendResponse(res, null);
};

