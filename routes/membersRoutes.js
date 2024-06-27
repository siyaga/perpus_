const express = require("express");
const router = express.Router();
const members = require("../repositories/membersRepository"); // Assumi
const books = require("../repositories/booksRepository"); // Assumingng userRepository exports the CRUD functions
const pinjam = require("../repositories/pinjamRepository"); // Assuming userRepository exports the CRUD functions
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

// GET /members - Get all members
router.get(
  "/pinjam",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get page number from query parameter, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query parameter, default to 10
    const search = req.query.search || ""; // Get limit from query parameter, default to 10

    const offset = (page - 1) * limit; // Calculate offset for pagination

    const { count, rows } = await pinjam.getAll({
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
  "/:code",
  asyncHandler(async (req, res) => {
    const memberId = req.params.code;
    // Extract the numeric part of the code
    const member = await members.getById(memberId);
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
  "/:code",
  validateUser,
  asyncHandler(async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendApiResponseSingle(res, errors.array(), "error message", 400);
        // return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;
      const memberId = req.params.code;
      // Extract the numeric part of the code
      const existingMember = await members.getById(memberId);
      if (existingMember && existingMember.name !== name) {
        // Check if a member with the same name already exists (excluding the current member)
        const existingName = await members.getByName(name);
        if (existingName && existingName.code !== existingMember.code) {
          return sendApiResponseSingle(
            res,
            null,
            "A member with this name already exists",
            400
          );
        }
      }
      const updatedMembers = await members.update(memberId, { name });

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

// POST /members - Create a new members
const validatePinjamPengembalaian = [
  body("code_book").trim().notEmpty().withMessage("Code Book is required"),
  body("code_member").trim().notEmpty().withMessage("Code Members is required"),
];
// pinjam buku
// router.post(
//   "/pinjam",
//   validatePinjamPengembalaian,
//   asyncHandler(async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return sendApiResponseSingle(res, errors.array(), "error message", 400);
//         // return res.status(400).json({ errors: errors.array() });
//       }
//       pinjam;
//       const { code_book, code_member } = req.body;

//       const memberBooksCount = await pinjam.getByCodeMembers(code_member);
//       const booksStockCount = await books.getById(code_book);
//       console.log(memberBooksCount);
//       console.log(booksStockCount.dataValues.stock);
//       const checkPenalty = getPenalty[0].penalty;
//       if (
//         checkPenalty < new Date() ||
//         checkPenalty === null ||
//         checkPenalty === undefined
//       ) {
//         if (
//           putBooks.length < 1 ||
//           body.code_members === null ||
//           body.code_members === undefined
//         )
//           return sendApiResponseSingle(res, null, "Members not found", 404);
//         if (
//           getBooks.length < 1 ||
//           body.code_books === null ||
//           body.code_books === undefined
//         )
//           return sendApiResponseSingle(res, null, "Books not found", 404);

//         if (memberBooksCount.length >= 2) {
//           return sendApiResponseSingle(
//             res,
//             null,
//             "You cannot borrow more than 2 books",
//             400
//           );
//         }
//         if (booksStockCount.dataValues.stock <= 0) {
//           return sendApiResponseSingle(
//             res,
//             null,
//             "The book is already borrowed",
//             400
//           );
//         }

//         const updatedMembers = await pinjam.create({ code_book, code_member });
//         const updatedBooks = await books.updateStock(code_book, { stock });
//         updatedBooks;
//         if (updatedMembers) {
//           sendApiResponseSingle(
//             res,
//             updatedMembers,
//             "Members updated successfully",
//             200
//           );
//         } else {
//           sendApiResponseSingle(res, null, "Members not found", 404);
//         }
//       } else {
//         return (validasiMessage = `You cannot borrow books because you have a 3-day return penalty`);
//       }
//     } catch (error) {
//       console.error("Error fetching members:", error);
//       const message = "Failed to fetch members";
//       sendApiResponseSingle(res, "null", message, 500);
//     }
//   })
// );
router.post(
  "/pinjam",
  validatePinjamPengembalaian,
  asyncHandler(async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendApiResponseSingle(
          res,
          errors.array(),
          "Validation errors",
          400
        );
      }

      const { code_book, code_member } = req.body;

      // 1. Check if member exists
      const member = await members.getById(code_member);
      if (!member) {
        return sendApiResponseSingle(res, null, "Member not found", 404);
      }

      // 2. Check if book exists and has stock
      const book = await books.getById(code_book);
      if (!book || book.dataValues.stock <= 0) {
        return sendApiResponseSingle(res, null, "Book not available", 404);
      }

      // 3. Check if member has a penalty
      const penaltyRecords = await pinjam.getByMembersPenalty(code_member);
      if (penaltyRecords && penaltyRecords.penalty > new Date()) {
        const penaltyEndDate = new Date(penaltyRecords.penalty);
        penaltyEndDate.setDate(penaltyEndDate.getDate() + 3);
        return sendApiResponseSingle(
          res,
          null,
          `You cannot borrow books until ${penaltyEndDate.toLocaleDateString(
            "id-ID",
            { timeZone: "Asia/Jakarta" }
          )}`,
          400
        );
      }

      // 4. Check if member has borrowed more than 2 books
      const borrowedBooks = await pinjam.getByCodeMembers(code_member);
      if (borrowedBooks.length >= 2) {
        return sendApiResponseSingle(
          res,
          null,
          "You cannot borrow more than 2 books",
          400
        );
      }

      // 5. Create new borrowing record and update book stock
      await pinjam.create({ code_book, code_member });
      await books.updateStock(code_book);

      return sendApiResponseSingle(
        res,
        null,
        "Book borrowed successfully",
        200
      );
    } catch (error) {
      console.error("Error borrowing book:", error);
      return sendApiResponseSingle(res, null, "Failed to borrow book", 500);
    }
  })
);

// pengembalian buku
router.put(
  "/pengembalian",
  validatePinjamPengembalaian,
  asyncHandler(async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendApiResponseSingle(res, errors.array(), "error message", 400);
        // return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;
      const memberId = req.params.code;
      // Extract the numeric part of the code
      const existingMember = await members.getById(memberId);
      if (existingMember && existingMember.name !== name) {
        // Check if a member with the same name already exists (excluding the current member)
        const existingName = await members.getByName(name);
        if (existingName && existingName.code !== existingMember.code) {
          return sendApiResponseSingle(
            res,
            null,
            "A member with this name already exists",
            400
          );
        }
      }
      const updatedMembers = await members.update(memberId, { name });

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
  "/:code",
  asyncHandler(async (req, res) => {
    const memberId = req.params.code;
    // Extract the numeric part of the code

    const wasDeleted = await members.delete(memberId);
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
