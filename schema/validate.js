const Joi = require("@hapi/joi");

module.exports = (schema, data) => {
  const { value, error } = Joi.object(schema).validate(data);
  if (error) throw error;

  return value;
};
