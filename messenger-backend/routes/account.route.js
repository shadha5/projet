const express = require("express");
const { isActive } = require("../middleware/auth");

const {
  signUp,
  signIn,
  signOut,
  verifySession,
  updateAccount,
} = require("../controllers/account.controller");

const router = express.Router();

router.route("/sign-in").post(signIn);

router.route("/sign-up").post(signUp);

router.route("/sign-out").post(isActive, signOut);

router.route("/session").post(isActive, verifySession);

router.route("/account").put(isActive, updateAccount);

module.exports = router;
