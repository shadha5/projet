const express = require("express");
const { isActive } = require("../middleware/auth");

const { getPersonById } = require("../controllers/person.controller");

const router = express.Router();

router.route("/:personId").get(isActive, getPersonById);

module.exports = router;
