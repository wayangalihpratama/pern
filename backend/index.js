import express from "express";
import db from "./config/db.js";
import users from "./models/user.js";
import user_route from "./routes/user.js";

const app = express();
const port = 5000;

try {
  await db.authenticate();
  console.log("Database connected");
  // migrate table
  await users.sync();
} catch (error) {
  console.error("DB connection", error);
}

app.use(express.json()); // to receive data in json format

// route
app.use(user_route);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
