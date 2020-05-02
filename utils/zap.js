/**
 * Runs a script mapped in the Airtable
 */

const base = require("../control/airtable");
const comm = require("../control/comm");
const fetch = require("node-fetch");

module.exports = async (socket, message) => {
  const split = message.split(" ")
  const command = split[0];
  const parameters = split.slice(1).join(" ");

  const records = await base("runnable")
    .select({
      maxRecords: 1,
      view: "Grid view",
      filterByFormula: `{slug} = '${command}'`,
    })
    .all();

  if (records.length > 0) {
    const url = records[0].get("webhook");
    comm(socket, `Attempting to tap webhook ${url}...`, "info");
    fetch(`${url}?message=${parameters}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "success") {
          comm(socket, `Zap ${message} executed successfully.`, "success");
        } else {
          comm(socket, `Zap ${message} hit a snag. Check Zapier.`, "error");
        }

        socket.emit("end");
        return data.status == "success";
      });
  } else {
    comm(socket, `Zap ${message} is not registered. Check Airtable.`, "error");
    socket.emit("end");
    return false;
  }
};
