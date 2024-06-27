// userRepository.js
const { Op, DataTypes } = require("sequelize");
const Pinjam = require("../models/pinjam");
const { now, addDays } = require("date-fns");

const pinjam = {
  getAll: async (options = {}) => {
    // Accept options object
    const { limit, offset, search } = options; // Extract limit and offset
    let where = {}; // Initialize where clause
    if (search) {
      where = {
        [Op.or]: [
          // Use Op.or for OR conditions
          { code_member: { [Op.iLike]: `%${search}%` } },
          { code_book: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }
    const { count, rows } = await Pinjam.findAndCountAll({
      limit,
      offset,
      where,
      order: [["createdAt", "ASC"]],
    });
    return { count, rows }; // Return count and rows
  },
  getByMembersPenalty: async (code_members) => {
    const currentDate = new Date();
    const penaltyStartDate = addDays(currentDate, -10); // 10 days ago

    const pinjam = await Pinjam.findAll({
      where: {
        code_members,
        tanggal_pengembalian: { [Op.lt]: penaltyStartDate }, // Books returned late
        deletedAt: null, // Exclude soft-deleted records
      },
    });
    return pinjam;
  },
  getByCodeMembers: async (code_members) => {
    const pinjam = await Pinjam.findAll({ where: { code_members } });
    return pinjam;
  },

  getByCodeBooks: async (code_books) => {
    const pinjam = await Pinjam.findOne({ where: { code_books } });
    return pinjam;
  },

  getByMembersPenalty: async (code_members, code_books) => {
    const pinjam = await Pinjam.findAll({ where: { code_members } });
    return pinjam;
  },

  getByTitle: async (title) => {
    const pinjam = await Pinjam.findOne({ where: { title } });
    return pinjam;
  },
  getById: async (code) => {
    console.log(code);
    const pinjam = await Pinjam.findOne({ where: { code } });
    return pinjam;
  },

  create: async (booksData) => {
    const { code_book, code_member } = booksData;
    const tanggal_pinjam = new Date();
    console.log(tanggal_pinjam);
    const tanggal_pengembalian = addDays(tanggal_pinjam, 7);
    const pinalty = null;

    console.log(tanggal_pinjam);
    console.log(tanggal_pengembalian);
    // Create a new Pinjam instance with the provided data
    const newPinjam = await Pinjam.create({
      code_books: code_book,
      code_members: code_member,
      tanggal_pinjam: tanggal_pinjam,
      tanggal_pengembalian: tanggal_pengembalian,
      pinalty: pinalty,
    });

    // Return the newly created Pinjam instance
    return newPinjam;
  },

  update: async (code, booksData) => {
    const pinjam = await Pinjam.findOne({ where: { code } });
    if (!pinjam) {
      return null;
    }
    return await pinjam.update(booksData);
  },

  delete: async (code) => {
    const pinjam = await Pinjam.findOne({ where: { code } });
    if (!pinjam) {
      return null;
    }
    await pinjam.destroy();
    return true;
  },
};

module.exports = pinjam;
