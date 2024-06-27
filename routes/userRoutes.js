const express = require("express");
const router = express.Router();
const users = require("../repositories/userRepository"); // Assuming userRepository exports the CRUD functions
const { body, validationResult } = require("express-validator"); //for validation
const asyncHandler = require("express-async-handler"); //for handle async function
const sendApiResponse = require("../utils/response"); // Import the sendApiResponse function
const sendApiResponseSingle = require("../utils/response_single"); // Import the sendApiResponse function

// GET /users - Get all users
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get page number from query parameter, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query parameter, default to 10

    const offset = (page - 1) * limit; // Calculate offset for pagination

    const { count, rows } = await users.getAll({
      limit,
      offset,
    });
    const data = rows || null;
    const total = count || 0;
    sendApiResponse(
      res,
      data,
      page,
      limit,
      total,
      "data successfuly show",
      200
    );
  })
);

// GET /users/:id - Get a single user by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await users.getById(userId);
    if (user == null || user == undefined) {
      message = "User not found";
      status_response = 404;
    } else {
      message = "data successfuly show";
      status_response = 200;
    }
    sendApiResponseSingle(res, user, message, status_response);
    // if (!user) {
    //   res.status(404).json({ error: "User not found" });
    // } else {
    //   res.json(user);
    // }
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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendApiResponseSingle(res, errors.array(), "error message", 200);
        // return res.status(400).json({ errors: errors.array() });
      }

      const { name, email } = req.body;
      const newUser = await users.create({ name, email });
      const message = "user successfully created";
      sendApiResponseSingle(res, newUser, message, 200);
      // res.status(201).json(newUser);
    } catch (error) {
      console.error("Error fetching users:", error);
      const message = "Failed to fetch users";
      sendApiResponseSingle(res, "null", message, 500);
    }
  })
);

// PUT /users/:id - Update a user by ID
router.put(
  "/:id",
  validateUser,
  asyncHandler(async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendApiResponseSingle(res, errors.array(), "error message", 400);
        // return res.status(400).json({ errors: errors.array() });
      }

      const { name, email } = req.body;
      const userId = parseInt(req.params.id);

      const updatedUser = await users.update(userId, { name, email });

      if (updatedUser) {
        sendApiResponseSingle(
          res,
          updatedUser,
          "User updated successfully",
          200
        );
      } else {
        sendApiResponseSingle(res, null, "User not found", 404);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const message = "Failed to fetch users";
      sendApiResponseSingle(res, "null", message, 500);
    }
  })
);

// DELETE /users/:id - Delete a user by ID
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const wasDeleted = await users.delete(userId);
    console.log(wasDeleted);
    if (wasDeleted == null || wasDeleted == undefined) {
      message = "User not found";
      status_response = 404;
    } else {
      message = "user successfuly deleted";
      status_response = 200;
    }
    sendApiResponseSingle(res, null, message, status_response);
  })
);

module.exports = router;
