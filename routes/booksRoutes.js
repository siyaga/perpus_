const express = require("express");
const router = express.Router();
const books = require("../repositories/booksRepository"); // Assuming userRepository exports the CRUD functions
const { body, validationResult } = require("express-validator"); //for validation
const asyncHandler = require("express-async-handler"); //for handle async function
const sendApiResponse = require("../utils/response"); // Import the sendApiResponse function
const sendApiResponseSingle = require("../utils/response_single"); // Import the sendApiResponse function

// GET /books - Get all books
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get page number from query parameter, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query parameter, default to 10

    const offset = (page - 1) * limit; // Calculate offset for pagination

    const { count, rows } = await books.getAll({
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

// GET /books/:id - Get a single books by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const memberId = parseInt(req.params.id);
    const books = await books.getById(memberId);
    if (books == null || books == undefined) {
      message = "books not found";
      status_response = 404;
    } else {
      message = "data successfuly show";
      status_response = 200;
    }
    sendApiResponseSingle(res, books, message, status_response);
    // if (!books) {
    //   res.status(404).json({ error: "books not found" });
    // } else {
    //   res.json(books);
    // }
  })
);

// POST /books - Create a new books
const validateUser = [
  body("code").trim().notEmpty().withMessage("Name is required"),
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("title").trim().notEmpty().withMessage("title is required"),
  body("author").trim().notEmpty().withMessage("author is required"),
  body("stock").trim().notEmpty().withMessage("stock is required"),
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

      const { code, name, title, author, stock } = req.body;
      const newUser = await books.create({ code, name, title, author, stock });
      const message = "Books successfully created";
      sendApiResponseSingle(res, newUser, message, 200);
      // res.status(201).json(newUser);
    } catch (error) {
      console.error("Error fetching books:", error);
      const message = "Failed to fetch books";
      sendApiResponseSingle(res, "null", message, 500);
    }
  })
);

// PUT /books/:id - Update a books by ID
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

      const { name, title, author, stock } = req.body;
      const booksId = parseInt(req.params.id);

      const updatedBooks = await books.update(booksId, {
        name,
        title,
        author,
        stock,
      });

      if (updatedBooks) {
        sendApiResponseSingle(
          res,
          updatedBooks,
          "Books updated successfully",
          200
        );
      } else {
        sendApiResponseSingle(res, null, "Books not found", 404);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      const message = "Failed to fetch books";
      sendApiResponseSingle(res, "null", message, 500);
    }
  })
);

// DELETE /books/:id - Delete a books by ID
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const booksId = parseInt(req.params.id);
    const wasDeleted = await books.delete(booksId);
    console.log(wasDeleted);
    if (wasDeleted == null || wasDeleted == undefined) {
      message = "books not found";
      status_response = 404;
    } else {
      message = "books successfuly deleted";
      status_response = 200;
    }
    sendApiResponseSingle(res, null, message, status_response);
  })
);

module.exports = router;
