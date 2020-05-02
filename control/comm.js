/**
 * A module that handles the regulation of serverside messages
 */

const commsSchema = require("../schema/communication");
const validate = require("../schema/validate");

module.exports = (socket, message, state) => {
  let data;

  try {
    data = validate(commsSchema, {
      message: message,
      ts: new Date(),
      state: state,
      origin: "JARVIS",
    });
  } catch (err) {
    return {
      ok: false,
      error: err.details[0].message,
    };
  }

  socket.emit("comm", data);
  return {
      ok: true
  }
};
