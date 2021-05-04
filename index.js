var express = require('express');
var expressWs = require('express-ws');
var expressWs = expressWs(express());
var app = expressWs.app;
const port = process.env.PORT || 3001
app.use(express.static('public'));
var aWss = expressWs.getWss('/');
const defaultMinute = 100
const speed = 1000 // change this to speed up for testing: 60000 = 1 min
var m = defaultMinute
var timer = false

function countdown() {
  function run() {
    timer = setInterval(() => {
      if (m > -1) {
        Array.from(
          aWss.clients
        ).filter((sock) => {
          return sock.route == '/' /* <- Your path */
        }).forEach(function (client) {
          client.send(m--);
        });
        console.log(m)
      }else{
        clearInterval(timer)
      }
    }, speed);
  }
  if (timer != false) {
    clearInterval(timer)
    run()
  } else {
    run()
  }
}

app.ws('/', function (ws, req) {
  console.log('Socket Connected');

  ws.onclose = function (e) {
    console.log('Disconnected!');
  };


  ws.route = '/';  /* <- Your path */
  ws.onmessage = function (msg) {
    console.log(msg.data);
    // START 
    if (msg.data == 'start') {
      console.log('starting')
      m = defaultMinute
      countdown()
      Array.from(
        aWss.clients
      ).filter((sock) => {
        return sock.route == '/' /* <- Your path */
      }).forEach(function (client) {
        client.send(defaultMinute);
      });
    };
    // STOP
    if (msg.data == 'stop') {
      console.log('stopping')
      counting = false
      //  clearInterval(countdown)
    }
    if (msg.data == 'resetTimer') {
      counting = false
      console.log('reseting')
      m = defaultMinute
      Array.from(
        aWss.clients
      ).filter((sock) => {
        return sock.route == '/' /* <- Your path */
      }).forEach(function (client) {
        client.send(defaultMinute);
      });
      counting = true
    }
  }
})
app.listen(port);