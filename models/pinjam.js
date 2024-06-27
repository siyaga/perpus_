const { DataTypes } = require("sequelize");
const { sequelize } = require("../config"); // Assuming you have your Sequelize config set up

const Pinjam = sequelize.define(
  "Pinjam",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tanggal_pinjam: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const date = this.getDataValue("tanggal_pinjam");
        const formattedDate = date.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          year: "numeric", // Include year
          month: "2-digit", // Include month in 2-digit format
          day: "2-digit", // Include day in 2-digit format
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return formattedDate.replace(/\//g, "-"); // Replace '/' with '-'
      },
    },
    tanggal_pengembalian: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        const date = this.getDataValue("tanggal_pengembalian");
        const formattedDate = date
          ? date
              .toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
                year: "numeric", // Include year
                month: "2-digit", // Include month in 2-digit format
                day: "2-digit", // Include day in 2-digit format
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
              .replace(/\//g, "-") // Replace '/' with '-'
          : null; // Format as YYYY-MM-DD HH:MI:SS or null if not deleted
        return formattedDate;
      },
    },
    code_members: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code_books: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    penalty: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        const date = this.getDataValue("penalty");
        const formattedDate = date
          ? date
              .toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
                year: "numeric", // Include year
                month: "2-digit", // Include month in 2-digit format
                day: "2-digit", // Include day in 2-digit format
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
              .replace(/\//g, "-") // Replace '/' with '-'
          : null; // Format as YYYY-MM-DD HH:MI:SS or null if not deleted
        return formattedDate;
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set current timestamp on creation
      get() {
        const date = this.getDataValue("createdAt");
        const formattedDate = date.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          year: "numeric", // Include year
          month: "2-digit", // Include month in 2-digit format
          day: "2-digit", // Include day in 2-digit format
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return formattedDate.replace(/\//g, "-"); // Replace '/' with '-'
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set current timestamp on creation
      onUpdate: DataTypes.NOW, // Update timestamp on update
      get() {
        const date = this.getDataValue("updatedAt");
        const formattedDate = date.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          year: "numeric", // Include year
          month: "2-digit", // Include month in 2-digit format
          day: "2-digit", // Include day in 2-digit format
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return formattedDate.replace(/\//g, "-"); // Replace '/' with '-'
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      get() {
        const date = this.getDataValue("deletedAt");
        const formattedDate = date
          ? date
              .toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
                year: "numeric", // Include year
                month: "2-digit", // Include month in 2-digit format
                day: "2-digit", // Include day in 2-digit format
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
              .replace(/\//g, "-") // Replace '/' with '-'
          : null; // Format as YYYY-MM-DD HH:MI:SS or null if not deleted
        return formattedDate;
      },
    },
  },
  {
    tableName: "pinjam",
    freezeTableName: true,
    paranoid: true,
  }
);

module.exports = Pinjam;
