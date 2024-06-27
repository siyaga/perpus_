// userRepository.js
const { Op } = require("sequelize");
const Members = require("../models/members");

const members = {
  getAll: async (options = {}) => {
    // Accept options object
    const { limit, offset, search } = options; // Extract limit and offset
    let where = {}; // Initialize where clause
    console.log(search);
    if (search) {
      where.name = { [Op.like]: `%${search}%` }; // Add name search condition
    }
    const { count, rows } = await Members.findAndCountAll({
      limit,
      offset,
      where,
      order: [["createdAt", "ASC"]],
    });
    return { count, rows }; // Return count and rows
  },
  getByName: async (name) => {
    const member = await Members.findOne({ where: { name } });
    return member;
  },
  getById: async (id) => {
    const members = await Members.findByPk(id);
    return members;
  },

  create: async (booksData) => {
    return await Members.create(booksData);
  },

  update: async (id, booksData) => {
    const members = await Members.findByPk(id);
    console.log(members);
    if (!members) {
      return null;
    }
    return await members.update(booksData);
  },

  delete: async (id) => {
    const members = await Members.findByPk(id);
    if (!members) {
      return null;
    }
    await members.destroy();
    return true;
  },
};

module.exports = members;
