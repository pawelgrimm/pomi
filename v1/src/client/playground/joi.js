const Joi = require("joi");

const regex = /(^[a-z]*)([A-Z].*$)/g;

const schema = Joi.object().rename(regex, Joi.expression("{#1}_{#2}"));

const input = {
  dateTime: "x",
  son: "y",
  bass: "z",
  "my mom": "w",
};

const value = Joi.compile(schema).validate(input);
console.log(value);
// value === { x123x: 'x', x1x: 'y', x0x: 'z', x4x: 'test' }
