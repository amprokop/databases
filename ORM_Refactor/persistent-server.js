var http = require("http");
var handlers = require('./request-handler');
var url = require('url');
var serverHelpers = require('./server-helpers');

/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */
var port = 3000;
var ip = "127.0.0.1";

var router = function(req, res) {

  var path = url.parse(req.url).pathname;
  var method = req.method;

  if (path === '/classes/messages') {
    if (method === 'POST') {
      handlers.postMessage(req, res);
    } else if (method === 'GET') {
      handlers.getMessages(req, res);
    } else if (method === 'OPTIONS') {
      handlers.sendOptionsResponse(req, res);
    }
  } else {
    handlers.sendResponse(res, '', 404);
  }
}

var server = http.createServer(function(req, res) {
  router(req, res);
});

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
