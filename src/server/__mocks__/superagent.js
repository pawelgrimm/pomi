const { isValid, parseISO } = require("date-fns");
const superagent = jest.requireActual("superagent");

const parser = function (res, fn) {
  res.text = "";
  res.setEncoding("utf8");
  res.on("data", function (chunk) {
    res.text += chunk;
  });
  res.on("end", function () {
    try {
      fn(null, JSON.parse(res.text, rectifier));
    } catch (err) {
      fn(err);
    }
  });
};

function rectifier(key, value) {
  if (typeof value === "string" && key !== "syncToken") {
    const parsedDate = parseISO(value);
    return isValid(parsedDate) ? parsedDate : value;
  }
  return value;
}

superagent.parse["application/json"] = parser;

module.exports = superagent;
