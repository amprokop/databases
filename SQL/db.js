var mysql = require('mysql');

var dbConnection = mysql.createConnection({
	user: "root",
	password: "",
	database: "chat"
});

dbConnection.connect();

// written in the node style for compatibility with bluebird's `.promisify` method.
var executeQuery = function(query, param, cb){
	// flexible API~
	if (!cb) {
		cb = param;
		dbConnection.query(query, function(err, results){
			cb(err, results);
		});
	} else {
		dbConnection.query(query, param, function(err, results){
			cb(err, results);
		});
	}
};

// best practice--- when joining tables, use messages.text, users.username, etc inside the SELECT clause
// instead of just `text`, `username`
// befuddling naming collisions can happen to YOU!
exports.findAllMessages = function(cb){
	executeQuery('SELECT messages.id, messages.text, messages.roomname, users.username \
								 FROM messages LEFT OUTER JOIN users ON messages.userid = users.id \
								 ORDER BY messages.id DESC', cb);
};

exports.findUser = function(username, cb){

	executeQuery('SELECT * FROM users WHERE username = ? LIMIT 1', [username], cb);
};

exports.saveUser = function(username, cb){

	executeQuery('INSERT INTO users SET ?', username, cb);
};

exports.saveMessage = function(message, cb){

	executeQuery('INSERT INTO MESSAGES SET ?', message, cb);
};
