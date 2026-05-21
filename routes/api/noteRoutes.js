// Requirements
const router = require("express").Router();
const { Note } = require("../../models");
const { authMiddleware } = require("../../utils/auth");

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/notes = Get all notes for a logged-in user
router.get("/", async (requestAnimationFrame, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /api/notes - Create a new note
router.post("/", async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});
