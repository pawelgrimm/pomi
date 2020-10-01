const express = require("express");
const mountRoutes = require("./routes");
const { PORT } = require("./config/config");

const app = express();
app.use(express.json());
mountRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
