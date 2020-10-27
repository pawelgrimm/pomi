import express from "express";
import { mountRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.static("build"));
mountRoutes(app);

app.get("/*", function (req, res) {
  res.sendFile("index.html");
});

export default app;
