const { DataTypes } = require("sequelize");
const { sequelize } = require("../config"); // Assuming you have your Sequelize config set up

const Members = sequelize.define(
  "Members",
  {
    code: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
      // Add a custom getter to format the code
      get() {
        const rawValue = this.getDataValue("code");
        // Calculate the number of digits needed for padding
        const paddingLength = Math.max(3, rawValue.toString().length);
        return `M${rawValue.toString().padStart(paddingLength, "0")}`; // Format as "M001", "M010", "M100", etc.
      },
      // Add a custom setter to handle the raw value before saving
      set(value) {
        // You might want to add validation here to ensure the value is in the correct format
        this.setDataValue("code", value.substring(1));
      }, // Extract the numeric part
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "members",
    freezeTableName: true,
    paranoid: true,
  }
);

module.exports = Members;
