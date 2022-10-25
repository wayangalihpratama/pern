import users from "../models/user.js";

export const getUser = async (req, res) => {
  try {
    const data = await users.findAll();
    res.json(data);
  } catch (error) {
    console.error("getUser", error);
  }
};
