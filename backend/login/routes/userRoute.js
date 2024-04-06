const express = require("express");
const router = express.Router();
const {
  updateUserDetails,
  userRegister,
  userLogin,
  countUsersByRole,
  getRecentlyRegisteredUsers,
  updatePassword,
  getAllStudents,
  deleteUser,
  getAllTeachers,
  getAllAdmins,
  getStudentsBySection,
} = require("../controller/userController");
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/userCountsByRole", countUsersByRole);
router.get("/recentlyRegisteredUsers", getRecentlyRegisteredUsers);
router.post("/updatePassword", updatePassword);
router.get("/getAllStudents", getAllStudents);
router.put("/updateUserDetails", updateUserDetails);
router.delete("/deleteUser/:id", deleteUser);
router.get("/getAllTeachers", getAllTeachers);
router.get("/getAllAdmins", getAllAdmins);
router.get("/getStudentsBySection", getStudentsBySection);

module.exports = router;
