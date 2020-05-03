const socket = io();
const dialogue = $("#dialogue");
const command = $("#command");
const prompt = $("#prompt");

const stateColors = {
  success: "#3D9970",
  warning: "#FF851B",
  error: "#85144b",
  info: "#0074D9",
  user: "#000",
};

// temporary solution to display data
socket.on("comm", (data) => {
  if (data.origin == "server")
    $(
      `<p class="message ${data.origin}" id="log-${data.ts}" style="color: ${
        stateColors[data.state]
      }">JARVIS: ${data.message}</p>`
    ).hide().appendTo(dialogue).show("blind", {direction: "left"});
  else
    $(
      `<p class="message ${data.origin}" id="log-${data.ts}" style="color: ${
        stateColors[data.state]
      }">>> ${data.message}</p>`
    ).hide().appendTo(dialogue).show("blind", {direction: "left"});

    dialogue.scrollTop(dialogue[0].scrollHeight);
});

// server side command execution started
socket.on("start", () => toggleCommand(false));
socket.on("end", () => toggleCommand(true));
socket.on("clear", () => dialogue.html(""));

socket.on('disconnect', () => {
  dialogue.append(
    `<p class="message server" style="color: #000000">JARVIS: JARVIS is now disconnected.</p>`
  );
});

command.keypress((event) => {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") {
    socket.emit("comm", {
      message: command.val(),
      ts: new Date(),
      origin: "client",
      state: "user",
    });

    command.val("");
  }
});

$(document).keypress((event) => {
  if (!command.is(":focus")) {
    command.focus();
  }
});

$(() => {
  dialogue.val("");
  command.val("");
});

let toggleCommand = (enable) => {
  if (enable) {
    // enable
    command.prop("disabled", false);
    command.css("cursor", "text");
    command.val("");
  } else {
    // disable
    command.prop("disabled", true);
    command.css("cursor", "default");
    command.val("Awaiting response from Jarvis ...");
  }
};
