const express = require("express");
const mountRoutes = require("./routes");

const app = express();
app.use(express.json());
mountRoutes(app);

module.exports = app;
