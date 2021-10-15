const express = require("express");
const { isActive } = require("../middleware/auth");

const {
  getAllContacts,
  getContactById,
  deleteContactById,
} = require("../controllers/contact.controller");

const router = express.Router();

router.route("/").get(isActive, getAllContacts);

router
  .route("/:contactId")
  .get(isActive, getContactById)
  .post(isActive, deleteContactById);

module.exports = router;
