import express from "express";
import db from "./config/db.js";
import users from "./models/user.js";

const app = express();
const port = 5000;

try {
  await db.authenticate();
  console.log("Database connected");
  // migrate table
  await users.sync();
} catch (error) {
  console.error(error);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
