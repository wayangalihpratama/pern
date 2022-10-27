"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.associate = function (models) {
        Todo.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      };
    }
  }
  Todo.init(
    {
      title: { type: DataTypes.TEXT, allowNull: false },
      description: { type: DataTypes.STRING },
      done: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
