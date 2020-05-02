require("dotenv").config();
const config = {};
for (entry in process.env) {
    config[entry] = process.env[entry];
}

module.exports = config;