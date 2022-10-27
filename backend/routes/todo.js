const express = require("express");
const todo_controller = require("../controller/todo.js");
const tokenFn = require("../middleware/token.js");

const todo_route = express.Router();

todo_route.get("/todos", tokenFn.verify, todo_controller.get);
todo_route.post("/todo", tokenFn.verify, todo_controller.post);
todo_route.put("/todo", tokenFn.verify, todo_controller.put);
todo_route.delete("/todo/:id", tokenFn.verify, todo_controller.delete);

module.exports = todo_route;
