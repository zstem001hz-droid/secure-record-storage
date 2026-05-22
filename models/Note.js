// Requirements
const { Schema, model } = require("mongoose");

// Note Schema
const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Associate note with user
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Note = model("Note", noteSchema);

module.exports = Note;
