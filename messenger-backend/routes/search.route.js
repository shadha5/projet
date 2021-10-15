const express = require("express");
const { isActive } = require("../middleware/auth");

const { searchPersons } = require("../controllers/person.controller");

const router = express.Router();

router.route("/").post(isActive, searchPersons);

module.exports = router;
