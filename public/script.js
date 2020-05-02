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

setInterval(() => {
  // command.focus();
  dialogue.scrollTop(dialogue[0].scrollHeight);
}, 50);

// temporary solution to display data
socket.on("comm", (data) => {
  dialogue.val(dialogue.val() + `\n${data.origin} > ${data.message}`);
  dialogue.css("border-color", stateColors[data.state]);
});

// server side command execution started
socket.on("start", () => toggleCommand(false));
socket.on("end", () => toggleCommand(true));
socket.on("clear", () => dialogue.val(""));

command.keypress((event) => {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") {
    socket.emit("comm", {
      message: command.val(),
      ts: new Date(),
      origin: "Mingjie",
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
    prompt.text("Jarvis >");
  } else {
    // disable
    command.prop("disabled", true);
    command.css("cursor", "default");
    command.val("Awaiting response from Jarvis ...");
    prompt.text("...");
  }
};
