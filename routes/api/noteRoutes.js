// Requirements
const router = require("express").Router();
const { Note } = require("../../models");
const { authMiddleware } = require("../../utils/auth");

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);
