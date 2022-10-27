const { Todo } = require("../models");

const getTodo = async (req, res) => {
  const { id: userId } = req;
  try {
    const data = await Todo.findAll({
      where: { userId: userId },
    });
    res.json(data);
  } catch (error) {
    console.error("getTodo", error);
  }
};

const addTodo = async (req, res) => {
  const { id: userId } = req;
  const { title, description, done } = req.body;
  try {
    await Todo.create({
      title: title,
      description: description,
      done: done,
      userId: userId,
    });
    res.json({ msg: "Todo saved successfully" });
  } catch (error) {
    console.error("post todo", error);
  }
};

const updateTodo = async (req, res) => {
  const { id: userId } = req;
  const { id, title, description, done } = req.body;
  try {
    const todo = await Todo.findAll({
      where: { id: id, userId: userId },
    });
    if (!todo.length) {
      return res.sendStatus(404);
    }
    await Todo.update(
      {
        title: title,
        description: description,
        done: done,
      },
      {
        where: { id: id },
      }
    );
    res.json({ msg: "Todo updated successfully" });
  } catch (error) {
    console.error("update todo", error);
  }
};

const deleteTodo = async (req, res) => {
  const { id: userId } = req;
  const { id } = req.params;
  try {
    const todo = await Todo.findAll({
      where: { id: id, userId: userId },
    });
    if (!todo.length) {
      return res.sendStatus(404);
    }
    await Todo.destroy({
      where: { id: id },
    });
    res.sendStatus(204);
  } catch (error) {
    console.error("update todo", error);
  }
};

const todo_controller = {
  get: getTodo,
  post: addTodo,
  put: updateTodo,
  delete: deleteTodo,
};

module.exports = todo_controller;
