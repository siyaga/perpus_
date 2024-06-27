const express = require("express");
const router = express.Router();
const members = require("../repositories/membersRepository"); // Assuming userRepository exports the CRUD functions
const { body, validationResult } = require("express-validator"); //for validation
const asyncHandler = require("express-async-handler"); //for handle async function

// GET /members - Get all members
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allUsers = await members.getAll();
    const page = parseInt(req.query.page) || 1; // Get page number from query parameter, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query parameter, default to 10

    const offset = (page - 1) * limit; // Calculate offset for pagination

    const { count, rows } = await members.getAll({
      limit,
      offset,
    }); // Get data with pagination

    res.json({
      data: rows, // Send the members as JSON
      page, // Send the current page number
      limit, // Send the limit per page
      count, // Send the total count of members
      status: 200, // Send the status code
    });
  })
);

// GET /members/:id - Get a single members by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const members = await members.getById(userId);
    if (!members) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(members);
    }
  })
);

// POST /members - Create a new members
const validateUser = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
];

router.post(
  "/",
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    const newUser = await members.create({ name, email });
    res.status(201).json(newUser);
  })
);

// PUT /members/:id - Update a members by ID
router.put(
  "/:id",
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    const updatedUser = await members.update(userId, { name, email });
    res.json(updatedUser);
  })
);

// DELETE /members/:id - Delete a members by ID
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const wasDeleted = await members.delete(userId);
    if (wasDeleted) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  })
);

module.exports = router;
