var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var contentTypeText = {"Content-Type": "text/plain"};
var listenedPort = 8888;

function send404(response){
    response.writeHead(404, contentTypeText);
    response.write("Error 404: resource not found");
    response.end();
}

function sendPage(response, filePath, fileContents) {
  response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

function serverWorking(response, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          send404(response)
        } else {
          sendPage(response, absPath, data);
        }
      });
    } else {
      send404(response);
    }
  });
}

function onRequest(request, response){
  var filePath = false;

  if (request.url == '/') {
    filePath = "public/index.html";
  } else {
    filePath = "public" + request.url;
  }

  var absPath = "./" + filePath;
  serverWorking(response, absPath);
}

var server = http.createServer(onRequest);
var port_number = server.listen(process.env.PORT || listenedPort);