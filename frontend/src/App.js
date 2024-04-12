import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./login/AuthContext";
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
import ViewCourses from "./admin/courses/ViewCourses";
import ViewAdmin from "./admin/admin/ViewAdmin";
import ViewSections from "./admin/sections/ViewSections";
import ViewClassroom from "./admin/classroom/ViewClassroom";
import ViewLibrary from "./admin/library/ViewLibrary";
import ViewLibrary1 from "./student/library/ViewLibrary";
import ViewSchedule from "./admin/schedule/ViewSchedule";
import ScheduleTable from "./admin/schedule/ScheduleTable";
import ViewAssignment from "./student/assignment/ViewAssignment";
import Hello from "./teacher/Hello";
import ViewAttendance from "./teacher/attendance/ViewAttendance";
import ViewAttendanceAdmin from "./admin/attendance/ViewAttendenceAdmin";
import OldAttendance from "./teacher/attendance/OldAttendance";
import UpdateAttendance from "./teacher/attendance/UpdateAttendance";
import ViewResult from "./teacher/result/ViewResult";
import ViewAssignmentByTeacher from "./teacher/assignment/ViewAssignmentByTeacher";
import ViewLibraryTeacher from "./teacher/library/ViewLibraryTeacher";
import ViewScheduleTeacher from "./teacher/schedule/ViewScheduleTeacher";
function App() {
  const { authenticated } = useAuth();
  const userRole = localStorage.getItem("userRole");
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Login />} />
        {/* Private Routes */}
        {authenticated ? (
          <>
            {/* Admin Routes */}
            <Route path="/admin/books" element={<ViewBooks />} />
            <Route path="/admin/addBooks" element={<AddBooks />} />
            <Route path="/admin/addStudent" element={<AddStudent />} />
            <Route path="/admin/students" element={<ViewStudents />} />
            <Route path="/admin/notice" element={<ViewNotice />} />
            <Route path="/admin/addNotice" element={<AddNotice />} />
            <Route path="/admin/addFood" element={<AddFood />} />
            <Route path="/admin/food" element={<ViewFood />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/admin/viewStudents" element={<ViewStudents />} />
            <Route path="/admin/viewCourses" element={<ViewCourses />} />
            <Route path="/admin/viewAdmins" element={<ViewAdmin />} />
            <Route path="/admin/viewClassroom" element={<ViewClassroom />} />
            <Route path="/admin/viewBooks" element={<ViewLibrary />} />
            <Route path="/admin/attendance" element={<ViewAttendanceAdmin />} />
            <Route path="/admin/ScheduleTable" element={<ScheduleTable />} />

            {/* Student Routes */}
            <Route path="/StudentDashboard" element={<StudentDachboard />} />
            <Route path="/admin/viewTeachers" element={<ViewTeacher />} />
            <Route path="/admin/viewSection" element={<ViewSections />} />
            <Route path="/admin/viewSchedule" element={<ViewSchedule />} />
            <Route path="/student/viewLibrary" element={<ViewLibrary1 />} />

            {/* Teacher Routes */}
            <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/attendance" element={<ViewAttendance />} />
            <Route path="/teacher/oldAttendance" element={<OldAttendance />} />
            <Route
              path="/teacher/viewAssignment"
              element={<ViewAssignmentByTeacher />}
            />
            <Route
              path="/teacher/viewLibrary"
              element={<ViewLibraryTeacher />}
            />
            <Route
              path="/teacher/viewSchedule"
              element={<ViewScheduleTeacher />}
            />
            <Route
              path="/teacher/updateAttendance"
              element={<UpdateAttendance />}
            />
            <Route path="/teacher/result" element={<ViewResult />} />
            <Route
              path="/student/ViewAssignment"
              element={<ViewAssignment />}
            />
            <Route path="/hello" element={<Hello />} />
            {userRole === "admin" && (
              <Route
                path="/"
                element={<Navigate to="/AdminDashboard" replace />}
              />
            )}
            {userRole === "student" && (
              <Route
                path="/"
                element={<Navigate to="/StudentDashboard" replace />}
              />
            )}
            {userRole === "teacher" && (
              <Route
                path="/"
                element={<Navigate to="/TeacherDashboard" replace />}
              />
            )}
          </>
        ) : (
          // Redirect unauthenticated users to the login page
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

function Main() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default Main;
