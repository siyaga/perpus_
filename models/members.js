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
  },
  {
    tableName: "members",
    freezeTableName: true,
  }
);

module.exports = Members;
