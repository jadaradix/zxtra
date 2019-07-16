var yans = require("yans");
var send = require("./send.js");


var server = new yans({
  "port": 1024,
  "directory": __dirname,
  "viewPath": "build",
  "logging": true,
  "loggingFormat": ":method :url -> HTTP :status; :response-time ms",
  "staticDirectories": []
});


server.start(function(err, port) {
  if (!err) {
    console.log("-> Server started! (port " + port.toString() + ")");
  } else {
    console.error("-> Server failed to start (" + err.toString() + ")");
    return process.exit(1);
  }
});


var delay = 200;
server.app.get("/send/*", function(req, res) {
  send.sendString(req.params[0], delay, function (error) {
    if (error) {
      return res.send("I couldn't send the string ('" + error + "').");
    } else {
      res.send("I sent the string!");
    }
  });
});

server.app.get("/sendtweets", function(req, res) {
  var tweets = [
    {
      "handle": "jadaradix",
      "text": "A tweet (1)."
    },
    {
      "handle": "ajcrsx",
      "text": "A tweet (2)."
    }
  ];
  var text = tweets.map(tweet => {
    return tweet.handle + ": " + tweet.text;
  }).join("\n\n");
  send.sendString(text, delay, function (error) {
    if (error) {
      return res.send("I couldn't send the string ('" + error + "').");
    } else {
      res.send("I sent the string!");
    }
  });
});

server.app.get("/sendgfx", function(req, res) {
  var bytes = [143, 128, 143, 128, 143, 128];
  send.sendBytes(bytes, delay, function (error) {
    if (error) {
      return res.send("I couldn't send the bytes ('" + error + "').");
    } else {
      res.send("I sent the bytes!");
    }
  });
});