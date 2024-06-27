// userRepository.js
const { Op } = require("sequelize");
const Books = require("../models/books");

const books = {
  getAll: async (options = {}) => {
    // Accept options object
    const { limit, offset, search } = options; // Extract limit and offset
    let where = {}; // Initialize where clause
    if (search) {
      where = {
        [Op.or]: [
          // Use Op.or for OR conditions
          { code: { [Op.like]: `%${search}%` } },
          { title: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    const { count, rows } = await Books.findAndCountAll({
      limit,
      offset,
      where,
      order: [["createdAt", "ASC"]],
    });
    return { count, rows }; // Return count and rows
  },
  getByTitle: async (title) => {
    const books = await Books.findOne({ where: { title } });
    return books;
  },
  getById: async (code) => {
    console.log(code);
    const books = await Books.findOne({ where: { code } });
    return books;
  },
  create: async (booksData) => {
    return await Books.create(booksData);
  },

  update: async (code, booksData) => {
    const books = await Books.findOne({ where: { code } });
    if (!books) {
      return null;
    }
    return await books.update(booksData);
  },

  delete: async (code) => {
    const books = await Books.findOne({ where: { code } });
    if (!books) {
      return null;
    }
    await books.destroy();
    return true;
  },
};

module.exports = books;
