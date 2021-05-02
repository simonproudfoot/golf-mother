var ip = require("ip");
var express = require('express');
var expressWs = require('express-ws');
var expressWs = expressWs(express());
var app = expressWs.app;

app.use(express.static('public'));

var aWss = expressWs.getWss('/');

app.ws('/', function(ws, req) {
  console.log('New totem connected');

  ws.onmessage = function(msg) {
    console.log(msg.data);
    aWss.clients.forEach(function (client) {
      client.send(msg.data);
    });
  };
});

app.listen(3001);