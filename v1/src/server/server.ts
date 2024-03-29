import express from "express";
import { mountRoutes } from "./routes";
import { handleError, logError } from "./middleware";
import { camelCaseQueryParams } from "./middleware/shared";

const app = express();
app.use(express.json());
app.use(express.static("build"));

app.use(camelCaseQueryParams);

mountRoutes(app);

app.get("/*", function (req, res) {
  res.sendFile("index.html");
});

app.use(logError);
app.use(handleError);

export default app;
