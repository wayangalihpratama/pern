const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const accessTokenExpire = "1hr";

const getUser = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(data);
  } catch (error) {
    console.error("getUser", error);
  }
};

const register = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  const match = await User.findAll({ where: { email: email } });
  if (match.length) {
    return res.status(400).json({ msg: "Email already used!" });
  }
  if (password !== confirm_password) {
    return res
      .status(400)
      .json({ msg: "Password & Confirm Password not match!" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await User.create({
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
    const login = await User.findAll({ where: { email: email } });
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
      { id: userId, name: userName, email: userEmail },
      ACCESS_TOKEN_SECRET,
      { expiresIn: accessTokenExpire }
    );
    const refreshToken = jwt.sign(
      { id: userId, name: userName, email: userEmail },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await User.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true // for https
    });
    res.json({ id: userId, name: userName, email: userEmail, accessToken });
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
    const user = await User.findAll({
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
        { id: userId, name: name, email: email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: accessTokenExpire }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    console.error("refresh token", error);
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.sendStatus(204);
  }
  const user = await User.findAll({
    where: { refresh_token: refreshToken },
  });
  if (!user.length) {
    return res.sendStatus(204);
  }
  // delete refresh token and clear cookie
  const { id: userId } = user[0];
  await User.update(
    { refresh_token: null },
    {
      where: { id: userId },
    }
  );
  res.clearCookie("refresh_token");
  return res.sendStatus(200);
};

const user_controller = {
  getUser: getUser,
  register: register,
  login: login,
  refreshToken: refreshToken,
  logout: logout,
};

module.exports = user_controller;
