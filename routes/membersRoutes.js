const express = require("express");
const router = express.Router();
const members = require("../repositories/membersRepository"); // Assuming userRepository exports the CRUD functions
const { body, validationResult } = require("express-validator"); //for validation
const asyncHandler = require("express-async-handler"); //for handle async function
const sendApiResponse = require("../utils/response"); // Import the sendApiResponse function
const sendApiResponseSingle = require("../utils/response_single"); // Import the sendApiResponse function

// GET /members - Get all members
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get page number from query parameter, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query parameter, default to 10
    const search = req.query.search || ""; // Get limit from query parameter, default to 10

    const offset = (page - 1) * limit; // Calculate offset for pagination

    const { count, rows } = await members.getAll({
      limit,
      offset,
      search,
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

// GET /members/:id - Get a single members by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const memberId = req.params.id;
    // Extract the numeric part of the code
    const numericId = parseInt(memberId.substring(1));
    const member = await members.getById(numericId);
    if (member == null || member == undefined) {
      message = "member not found";
      status_response = 404;
    } else {
      message = "data successfuly show";
      status_response = 200;
    }
    sendApiResponseSingle(res, member, message, status_response);
    // if (!member) {
    //   res.status(404).json({ error: "member not found" });
    // } else {
    //   res.json(member);
    // }
  })
);

// POST /members - Create a new members
const validateUser = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];

router.post(
  "/",
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendApiResponseSingle(res, errors.array(), "error message", 200);
      // return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;
      // Check if a member with the same name already exists
      const existingMember = await members.getByName(name); // Assuming you have a getByName function in your repository
      if (existingMember) {
        return sendApiResponseSingle(
          res,
          null,
          "A member with this name already exists",
          400
        );
      }
      const newUser = await members.create({ name });
      const message = "Members successfully created";
      sendApiResponseSingle(res, newUser, message, 200);
      // res.status(201).json(newUser);
    } catch (error) {
      console.error("Error fetching members:", error);
      const message = "Failed to fetch members";
      sendApiResponseSingle(res, "null", message, 500);
    }
  })
);

// PUT /members/:id - Update a members by ID
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

      const { name } = req.body;
      const memberId = req.params.id;
      // Extract the numeric part of the code
      const numericId = parseInt(memberId.substring(1));
      const existingMember = await members.getById(numericId);
      if (existingMember && existingMember.name !== name) {
        // Check if a member with the same name already exists (excluding the current member)
        const existingName = await members.getByName(name);
        if (existingName && existingName.id !== numericId) {
          return sendApiResponseSingle(
            res,
            null,
            "A member with this name already exists",
            400
          );
        }
      }
      const updatedMembers = await members.update(numericId, { name });

      if (updatedMembers) {
        sendApiResponseSingle(
          res,
          updatedMembers,
          "Members updated successfully",
          200
        );
      } else {
        sendApiResponseSingle(res, null, "Members not found", 404);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      const message = "Failed to fetch members";
      sendApiResponseSingle(res, "null", message, 500);
    }
  })
);

// DELETE /members/:id - Delete a members by ID
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const memberId = req.params.id;
    // Extract the numeric part of the code
    const numericId = parseInt(memberId.substring(1));
    const wasDeleted = await members.delete(numericId);
    console.log(wasDeleted);
    if (wasDeleted == null || wasDeleted == undefined) {
      message = "members not found";
      status_response = 404;
    } else {
      message = "members successfuly deleted";
      status_response = 200;
    }
    sendApiResponseSingle(res, null, message, status_response);
  })
);

module.exports = router;
