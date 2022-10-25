import users from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getUser = async (req, res) => {
  try {
    const data = await users.findAll({
      attributes: ["id", "name", "email"],
    });
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const login = await users.findAll({ where: { email: email } });
    const {
      id: userId,
      name: userName,
      email: userEmail,
      password: userPassword,
    } = login[0];
    const match = await bcrypt.compare(password, userPassword);
    if (!match) {
      return req.status(400).json({ msg: "Wrong password!" });
    }
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
    const accessToken = jwt.sign(
      { userId, userName, userEmail },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );
    const refreshToken = jwt.sign(
      { userId, userName, userEmail },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true // for https
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "User not found!" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.sendStatus(401);
    }
    const user = await users.findAll({
      where: { refresh_token: refreshToken },
    });
    if (!user.length) {
      return res.sendStatus(403);
    }
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      const { id: userId, name, email } = user[0];
      const accessToken = jwt.sign(
        { userId, name, email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "20s" }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    console.error("refresh token", error);
  }
};

const user_controller = {
  getUser: getUser,
  register: register,
  login: login,
  refreshToken: refreshToken,
};

export default user_controller;
