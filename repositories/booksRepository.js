// userRepository.js
const Books = require("../models/books");

const books = {
  getAll: async (options = {}) => {
    // Accept options object
    const { limit, offset } = options; // Extract limit and offset
    const { count, rows } = await Books.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "ASC"]],
    });
    return { count, rows }; // Return count and rows
  },

  getById: async (id) => {
    const books = await Books.findByPk(id);
    return books;
  },

  create: async (booksData) => {
    return await Books.create(booksData);
  },

  update: async (id, booksData) => {
    const books = await Books.findByPk(id);
    if (!books) {
      return null;
    }
    return await books.update(booksData);
  },

  delete: async (id) => {
    const books = await Books.findByPk(id);
    if (!books) {
      return null;
    }
    await books.destroy();
    return true;
  },
};

module.exports = books;
