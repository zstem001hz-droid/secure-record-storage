// Requirements
const router = require("express").Router();
const { Note } = require("../../models");
const { authMiddleware } = require("../../utils/auth");

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/notes = Get all notes for a logged-in user
router.get("/", async (requestAnimationFrame, res) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});
