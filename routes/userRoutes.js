const express = require("express");
const router = express.Router();
const users = require("../repositories/userRepository"); // Assuming userRepository exports the CRUD functions
const { body, validationResult } = require("express-validator"); //for validation
const asyncHandler = require("express-async-handler"); //for handle async function

// GET /users - Get all users
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allUsers = await users.getAll();

    if (allUsers.length > 0) {
      res.json(allUsers); // Send the users as JSON if there are any
    } else {
      res.status(200).json({ message: "No users found" }); // Send a 200 OK with a message if there are no users
    }
  })
);

// GET /users/:id - Get a single user by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await users.getById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user);
    }
  })
);

// POST /users - Create a new user
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
    const newUser = await users.create({ name, email });
    res.status(201).json(newUser);
  })
);

// PUT /users/:id - Update a user by ID
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
    const updatedUser = await users.update(userId, { name, email });
    res.json(updatedUser);
  })
);

// DELETE /users/:id - Delete a user by ID
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const wasDeleted = await users.delete(userId);
    if (wasDeleted) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  })
);

module.exports = router;
