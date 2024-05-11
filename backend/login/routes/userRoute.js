// Function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

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
    const { registeredUsers, failedUsers } = await registerUsersFromExcel(
      excelData
    );
    res.status(201).json({
      message: "Users registered successfully",
      registeredUsers: registeredUsers,
      failedUsers: failedUsers,
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
        role: "student",
        registrationDate: new Date(),
        semester: row.getCell(4).value,
        course: row.getCell(5).value,
        sections: row.getCell(6).value
          ? [String(row.getCell(6).value).trim()]
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
  const failedUsers = [];

  const existingEmails = new Set(); // Set to store existing email addresses

  for (const userData of excelData) {
    try {
      // Validation checks
      const { username, email, password, registrationDate, sections } =
        userData;

      // Check for whitespace in any field
      if (
        Object.values(userData).some(
          (value) => typeof value === "string" && /\s/.test(value)
        )
      ) {
        console.error("Whitespace found in user data:", userData);
        failedUsers.push(userData);

        continue; // Skip this user
      }

      // Check email format
      if (!email.endsWith("@heraldcollege.edu.np")) {
        console.error("Invalid email domain:", email);
        failedUsers.push(userData);
        continue; // Skip this user
      }

      // Check if email already exists in the database or in the current batch
      if (existingEmails.has(email) || (await User.exists({ email }))) {
        console.error("Email already exists:", email);
        failedUsers.push(userData);

        continue; // Skip this user
      }

      // Check if the password matches the default password
      if (password !== "prabesh") {
        console.error("Invalid password:", password);
        failedUsers.push(userData);

        continue; // Skip this user
      }

      // Check registration date
      const currentDate = new Date();
      const excelDate = new Date(registrationDate);
      if (!isSameDay(currentDate, excelDate)) {
        console.error("Invalid registration date:", registrationDate);
        failedUsers.push(userData);

        continue; // Skip this user
      }

      // Add email to the set of existing emails
      existingEmails.add(email);

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;

      const newUser = await User.create(userData);
      registeredUsers.push(newUser);

      // Send email to the newly registered user
      const emailSent = await sendEmail(
        newUser.email,
        "Registration Details",
        `Thank you for registering!\nEmail: ${newUser.email}\nPassword: ${password} \nSection: ${sections[0]}`
      );

      if (!emailSent) {
        console.error("Failed to send welcome email to:", newUser.email);
      }
    } catch (error) {
      console.error("Error registering user from Excel:", error);
      console.log(failedUsers);
    }
  }
  return { registeredUsers, failedUsers };
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
