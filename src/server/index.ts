import app from "./server";
import { PORT } from "./config";
import { closePool } from "./db";

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
