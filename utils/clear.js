/*
    Instructs the client to clear the current console
*/

module.exports = (socket, message) => {
  socket.emit("clear");
  socket.emit("end");

  return true;
};
