import { Sequelize } from "sequelize";

const db = new Sequelize("pern", "root", "root", {
  host: "localhost",
  dialect: "postgres",
});

export default db;
