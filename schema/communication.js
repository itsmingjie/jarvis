const Joi = require("@hapi/joi");

module.exports = {
  // message string is required
  message: Joi.string().required(),

  // timestamp is required
  ts: Joi.date().timestamp('unix').required(),

  // state message is required
  state: Joi.string().valid("success", "warning", "error", "info", "user").required(),

  // origin is required
  origin: Joi.string().required()
};