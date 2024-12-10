const express = require("express");
const {
  createAccount,
  loginAccount,
  createAdminOrStaff,
  setMetamaskId,
  getUserByMetamaskId,
} = require("../controllers/userController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.route("/createAccount").post(createAccount);
router.route("/loginAccount").post(loginAccount);
router.route("/createAdminOrStaff").post(isAuthenticated, createAdminOrStaff);
router.route("/setMetamaskId").post(isAuthenticated, setMetamaskId);
router.route("/getUserByMetamaskId").get(isAuthenticated, getUserByMetamaskId);

module.exports = router;
