const { DataTypes } = require("sequelize");
const { sequelize } = require("../config"); // Assuming you have your Sequelize config set up

const Members = sequelize.define(
  "Members",
  {
    code: {
      type: DataTypes.STRING(10),
      autoIncrement: false,
      primaryKey: true,
      // Add a custom getter to format the code
      // Tidak perlu autoIncrement karena kita akan menangani penambahan secara manual
      get() {
        const rawValue = this.getDataValue("code");
        // Memastikan format selalu M diikuti 3 digit angka
        return `M${parseInt(rawValue.substring(1), 10)
          .toString()
          .padStart(3, "0")}`;
      },
      set(value) {
        // Validasi format input (harus berupa M diikuti 3 digit angka)
        if (!/^M\d{3}$/.test(value)) {
          throw new Error(
            "Kode anggota harus dalam format M diikuti 3 digit angka (contoh: M001)"
          );
        }
        this.setDataValue("code", value); // Jika valid, simpan langsung
      },
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

// Fungsi helper untuk mendapatkan kode anggota selanjutnya
async function getNextMemberCode() {
  const lastMember = await Members.findOne({
    order: [["code", "DESC"]],
  });

  if (!lastMember) {
    return "M001";
  }

  const lastCodeNumber = parseInt(lastMember.code.substring(1), 10);
  const nextCodeNumber = lastCodeNumber + 1;
  return `M${nextCodeNumber.toString().padStart(3, "0")}`;
}

// Hook 'beforeCreate'
Members.beforeCreate(async (member, options) => {
  member.code = await getNextMemberCode();
});

module.exports = Members;
