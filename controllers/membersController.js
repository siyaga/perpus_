// src/controllers/userController.js
const userRepository = require("../repositories/membersRepository");

class MembersController {
  async getAllUsers(req, res) {
    try {
      const users = await userRepository.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // ... (other controller methods for create, getById, update, delete)
}

module.exports = new MembersController();
