const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const User = require("../model/userModel");
const { sendEmail } = require("../controller/sendEmail");
const bcrypt = require("bcrypt");
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
router.post("/registerFromFile", upload.single("file"), async (req, res) => {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Extract data from the uploaded Excel file
  const excelData = await extractDataFromExcel(req.file.path);

  // Register users with the extracted data
  try {
    const registeredUsers = await registerUsersFromExcel(excelData);
    res.status(201).json({
      message: "Users registered successfully",
      users: registeredUsers,
    });
  } catch (error) {
    console.error("Error registering users from Excel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const extractDataFromExcel = async (filePath) => {
  const excel = require("exceljs");
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);

  const excelData = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      // Skip header row
      const rowData = {
        username: row.getCell(1).value,
        email: row.getCell(2).text,
        password: row.getCell(3).value,
        role: row.getCell(4).value,
        registrationDate: new Date(),
        semester: row.getCell(5).value,
        course: row.getCell(6).value,
        sections: row.getCell(7).value
          ? [String(row.getCell(7).value).trim()]
          : [], // Convert value to string before trimming
      };
      excelData.push(rowData);
    }
  });

  return excelData;
};

// Function to register users from the extracted Excel data
const registerUsersFromExcel = async (excelData) => {
  const registeredUsers = [];
  for (const userData of excelData) {
    try {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      const newUser = await User.create(userData);
      registeredUsers.push(newUser);

      // Send email to the newly registered user
      const emailSent = await sendEmail(
        newUser.email,
        "Registration Details",
        `Thank you for registering!\nEmail: ${newUser.email}\nPassword: ${userData.password} \nSection: ${userData.sections[0]}`
      );

      if (!emailSent) {
        console.error("Failed to send welcome email to:", newUser.email);
      }
    } catch (error) {
      console.error("Error registering user from Excel:", error);
    }
  }
  return registeredUsers;
};

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
