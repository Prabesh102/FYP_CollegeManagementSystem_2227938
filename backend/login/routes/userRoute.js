const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  countUsersByRole,
  getRecentlyRegisteredUsers,
} = require("../controller/userController");
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/userCountsByRole", countUsersByRole);
router.get("/recentlyRegisteredUsers", getRecentlyRegisteredUsers);

module.exports = router;
