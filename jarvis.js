const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const ver = require("./package.json").version;

const comm = require("./control/comm");
const utils = require("./utils/");

const port = process.env.PORT || 3000;

// serve UI
app.get("/*", express.static(path.join(__dirname, "/public")));

// run websocket
io.on("connection", (socket) => {
  comm(socket, `Welcome! JARVIS is connected. Server version: ${ver}`, "info");
  socket.emit("end");

  socket.on("comm", (data) => {
    socket.emit("start");
    socket.emit("comm", data);

    let message = data.message.split(" ");
    let command = message[0];
    let parameters = message.slice(1).join(" ");

    // source: https://stackoverflow.com/questions/19433932/call-function-from-string-in-nodejs
    if (command in utils && typeof utils[command] === "function") {
      if (!utils[command](socket, parameters)) {
        // command executed, but failed
        comm(socket, "Command exited unsuccessfully", "error");
      }
    } else {
      // non-existing command
      socket.emit("end");
      comm(socket, `${command} is not a valid JARVIS command.`, "error");
    }
  });
});

http.listen(port, () => {
  console.log(`JARVIS listening on *:${port}`);
});
