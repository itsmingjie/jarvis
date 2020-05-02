/*
    Server prints the message that the user sends.
*/

const comm = require("../control/comm");

module.exports = (socket, message) => {
  let res = comm(socket, message, "info");
  socket.emit("end");
  return res.ok;
};
