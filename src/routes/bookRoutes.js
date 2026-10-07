const express = require("express");
const { requireLogin } = require("../middleware/auth");
const { create } = require("../controllers/bookController");

const router = express.Router();

router.post("/", requireLogin, create);

module.exports = router;
