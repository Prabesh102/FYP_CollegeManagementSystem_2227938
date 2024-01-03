const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  countUsersByRole,
  getRecentlyRegisteredUsers,
  updatePassword,
} = require("../controller/userController");
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/userCountsByRole", countUsersByRole);
router.get("/recentlyRegisteredUsers", getRecentlyRegisteredUsers);
router.post("/updatePassword", updatePassword);
module.exports = router;
