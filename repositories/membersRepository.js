// userRepository.js
const { Op } = require("sequelize");
const Members = require("../models/members");

const members = {
  getAll: async (options = {}) => {
    // Accept options object
    const { limit, offset, search } = options; // Extract limit and offset
    let where = {}; // Initialize where clause
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` }; // Add name search condition
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
  getById: async (code) => {
    const member = await Members.findOne({ where: { code } });
    return member;
  },

  create: async (booksData) => {
    return await Members.create(booksData);
  },

  update: async (code, booksData) => {
    const member = await Members.findOne({ where: { code } });
    console.log(member);
    if (!member) {
      return null;
    }
    return await member.update(booksData);
  },

  delete: async (code) => {
    const member = await Members.findOne({ where: { code } });
    if (!member) {
      return null;
    }
    await member.destroy();
    return true;
  },
};

module.exports = members;
