import users from "../models/user.js";
import bcrypt from "bcrypt";

const getUser = async (req, res) => {
  try {
    const data = await users.findAll();
    res.json(data);
  } catch (error) {
    console.error("getUser", error);
  }
};

const register = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res
      .status(400)
      .json({ msg: "Password & Confirm Password not match!" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await users.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: "Register success!" });
  } catch (error) {
    console.error("register", error);
  }
};

const user_controller = {
  getUser: getUser,
  register: register,
};

export default user_controller;
