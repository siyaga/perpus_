// userRepository.js
const Members = require("../models/members");

const members = {
  getAll: async () => {
    return await Members.findAll();
  },

  getById: async (id) => {
    return await Members.findByPk(id);
  },

  create: async (userData) => {
    return await Members.create(userData);
  },

  update: async (id, userData) => {
    const Members = await Members.findByPk(id);
    if (!Members) {
      throw new Error("Members not found"); // Or handle this in a more Members-friendly way
    }
    return await Members.update(userData);
  },

  delete: async (id) => {
    const Members = await Members.findByPk(id);
    if (!Members) {
      throw new Error("Members not found");
    }
    await Members.destroy();
    return true;
  },
};

module.exports = members;
