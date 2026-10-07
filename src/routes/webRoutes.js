const express = require("express");
const { home } = require("../controllers/webController");

const router = express.Router();

router.get("/", home);

module.exports = router;
