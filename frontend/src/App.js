import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ViewBooks from "./admin/library/ViewBooks";
import AddBooks from "./admin/library/AddBooks";
import AddStudent from "./admin/library/AddStudent";
import ViewStudent from "./admin/library/ViewStudent";
import ViewNotice from "./admin/library/ViewNotice";
import AddNotice from "./admin/library/AddNotice";
import AddFood from "./admin/library/AddFood";
import ViewFood from "./admin/library/ViewFood";
import Register from "./login/Register";
import Login from "./login/Login";
import StudentDachboard from "./student/StudentDachboard";
import TeacherDashboard from "./teacher/TeacherDashboard";
import AdminDashboard from "./admin/main/AdminDashboard";
import ViewStudents from "./admin/students/ViewStudents";
import ViewTeacher from "./admin/teachers/ViewTeacher";
// import LineChartComponent from "./admin/LineChartComponent";
function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/books" element={<ViewBooks />} />
        <Route path="/admin/addBooks" element={<AddBooks />} />
        <Route path="/admin/addStudent" element={<AddStudent />} />
        <Route path="/admin/students" element={<ViewStudent />} />
        <Route path="/admin/notice" element={<ViewNotice />} />
        <Route path="/admin/addNotice" element={<AddNotice />} />
        <Route path="/admin/addFood" element={<AddFood />} />
        <Route path="/admin/food" element={<ViewFood />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/admin/viewStudents" element={<ViewStudents />} />
        {/* Student Routes */}
        <Route path="/StudentDashboard" element={<StudentDachboard />} />
        <Route path="/admin/viewTeachers" element={<ViewTeacher />} />

        {/* Teacher Routes */}
        <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
        {/* <Route path="/graph" element={<LineChartComponent />} /> */}

        {/* Common Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
