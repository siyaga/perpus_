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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set current timestamp on creation
      get() {
        return this.getDataValue("createdAt")
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Format as YYYY-MM-DD HH:MI:SS
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set current timestamp on creation
      onUpdate: DataTypes.NOW, // Update timestamp on update
      get() {
        return this.getDataValue("updatedAt")
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Format as YYYY-MM-DD HH:MI:SS
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue("deletedAt")
          ? this.getDataValue("deletedAt")
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
          : null; // Format as YYYY-MM-DD HH:MI:SS or null if not deleted
      },
    },
  },
  {
    tableName: "users",
    freezeTableName: true,
    paranoid: true,
  }
);

module.exports = User;
