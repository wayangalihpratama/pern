import express from "express";
import user_controller from "../controller/user.js";
import tokenFn from "../middleware/token.js";

const user_route = express.Router();

user_route.get("/users", tokenFn.verify, user_controller.getUser);
user_route.post("/user", user_controller.register);
user_route.post("/login", user_controller.login);
user_route.get("/refresh_token", user_controller.refreshToken);

export default user_route;
