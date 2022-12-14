const express = require("express");
const user_controller = require("../controller/user.js");
const tokenFn = require("../middleware/token.js");

const user_route = express.Router();

user_route.get("/users", tokenFn.verify, user_controller.getUser);
user_route.post("/register", user_controller.register);
user_route.post("/login", user_controller.login);
user_route.get("/refresh_token", user_controller.refreshToken);
user_route.delete("/logout", user_controller.logout);

module.exports = user_route;
