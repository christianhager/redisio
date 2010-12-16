require("fs").readdirSync("./vendor").forEach(function(name){
  require.paths.unshift("./vendor/" + name + "/lib");  
});

/**
 * Important note: this application is not suitable for benchmarks!
 */

var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , io = require('./vendor/socket.io.server')
	, nstatic = require("node-static")
  , sys = require('sys')
  , server;
    
var fileServer = new nstatic.Server("./public");

server = http.createServer(function(request, response){
	request.addListener("end", function() {

    fileServer.serve(request, response, function (err, res) {
      if (err) { // An error as occured
        sys.error("> Error serving " + request.url + " - " + err.message);
        response.writeHead(err.status, err.headers);
        response.end();
      } else { // The file was served successfully
        sys.log("Serving " + request.url + " - " + res.message);
      }
    });

  });

  // your normal server code
  var path = url.parse(request.url).pathname;
  switch (path){
    case '/':
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('<h1>Welcome. Try the <a href="/chat.html">chat</a> example.</h1>');
      response.end();
      break;
      
    case '/json.js':
    case '/chat.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        response.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        response.write(data, 'utf8');
        response.end();
      });
      break;
      
    default: send404(response);
  }
}),

send404 = function(response){
  response.writeHead(404);
  response.write('404');
  response.end();
};

server.listen(8999);

// socket.io, I choose you
// simplest chat application evar
var io = io.listen(server)
  , buffer = [];
  
io.on('connection', function(client){
  client.send({ buffer: buffer });
  client.broadcast({ announcement: client.sessionId + ' connected' });
  
  client.on('message', function(message){
    var msg = { message: [client.sessionId, message] };
    buffer.push(msg);
    if (buffer.length > 15) buffer.shift();
    client.broadcast(msg);
  });

  client.on('disconnect', function(){
    client.broadcast({ announcement: client.sessionId + ' disconnected' });
  });
});
