const express = require("express");
const user_route = require("./routes/user.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// entrypoint
dotenv.config();
const app = express();
const port = 5000;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json()); // to receive data in json format

// route
app.use(user_route);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
