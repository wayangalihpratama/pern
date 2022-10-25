import express from "express";
import user_controller from "../controller/user.js";

const user_route = express.Router();

user_route.get("/users", user_controller.getUser);
user_route.post("/user", user_controller.register);

export default user_route;
