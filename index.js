var express = require('express');
var expressWs = require('express-ws');
var expressWs = expressWs(express());
var app = expressWs.app;
app.use(express.static('public'));
var aWss = expressWs.getWss('/');
// homepage
const port = process.env.PORT || 3001

const defaultMinute = 3
const speed = 60000 // change this to speed up for testing: 60000 = 1 min
var m = defaultMinute

var timer = false

function countdown() {
  function run() {
    timer = setInterval(() => {
      if (m > -1) {
        aWss.clients.forEach(function (client) {
          client.send(m);
        });
        console.log(m--)
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

app.get('/', (req, res) => {
  console.error('express connection');
  res.sendFile(path.join(__dirname, 'ws.html'));
});


app.ws('/totem', (ws, req) => {

  // restart timer when new totem connects
  console.log('New totem online');
  //console.log('Listening on:'+req.ip+':'+port)
  m = defaultMinute

  // LISTEN FOR MESSAGE
  ws.onmessage = (msg) => {
    console.log(msg.data)
    // START 
    if (msg.data == 'start') {
      console.log('starting')
      m = defaultMinute
      countdown()
      aWss.clients.forEach(function (client) {
        client.send(defaultMinute);
      });
    }

    // STOP
    if (msg.data == 'stop') {
      console.log('stopping')
      counting = false
      //  clearInterval(countdown)
    }

    // RESET
    if (msg.data == 'resetTimer') {
      counting = false
      console.log('reseting')
      m = defaultMinute
      aWss.clients.forEach(function (client) {
        client.send(defaultMinute);
      });
      counting = true
    }
  };
});

app.listen(port);