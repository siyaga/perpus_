const { DataTypes } = require("sequelize");
const { sequelize } = require("../config"); // Assuming you have your Sequelize config set up

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Built-in email validation
      },
    },
  },
  {
    tableName: "users",
    freezeTableName: true,
  }
);

module.exports = User;
