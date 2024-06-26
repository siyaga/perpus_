// userRepository.js
const User = require("../models/user");

const users = {
  getAll: async () => {
    return await User.findAll();
  },

  getById: async (id) => {
    return await User.findByPk(id);
  },

  create: async (userData) => {
    return await User.create(userData);
  },

  update: async (id, userData) => {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found"); // Or handle this in a more user-friendly way
    }
    return await user.update(userData);
  },

  delete: async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    await user.destroy();
    return true;
  },
};

module.exports = users;
