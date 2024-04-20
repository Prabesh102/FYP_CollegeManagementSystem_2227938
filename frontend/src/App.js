import React, { useEffect, useState } from "react";
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
import ViewAssignmentUi from "./teacher/assignment/ViewAssignmentUi";
import SubmittedTask from "./teacher/assignment/SubmittedTask";
import ViewAllAssignmentTeacher from "./teacher/assignment/ViewAllAssignmentTeacher";
import ViewSubmission from "./teacher/assignment/ViewSubmission";

function App() {
  const [loading, setLoading] = useState(true);

  const { authenticated, login } = useAuth();
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      login();
    }
    setLoading(false);
  }, [login]);

  if (loading) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {authenticated ? (
          <>
            {userRole === "admin" && (
              <>
                <Route path="/hello" element={<Hello />} />
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
                <Route
                  path="/admin/viewClassroom"
                  element={<ViewClassroom />}
                />
                <Route path="/admin/viewBooks" element={<ViewLibrary />} />
                <Route
                  path="/admin/attendance"
                  element={<ViewAttendanceAdmin />}
                />
                <Route
                  path="/admin/ScheduleTable"
                  element={<ScheduleTable />}
                />
                <Route path="/admin/viewTeachers" element={<ViewTeacher />} />
                <Route path="/admin/viewSection" element={<ViewSections />} />
                <Route path="/admin/viewSchedule" element={<ViewSchedule />} />
              </>
            )}
            {userRole === "student" && (
              <>
                <Route
                  path="/StudentDashboard"
                  element={<StudentDachboard />}
                />
                <Route
                  path="/student/ViewAssignment"
                  element={<ViewAssignment />}
                />
                <Route path="/student/viewLibrary" element={<ViewLibrary1 />} />
              </>
            )}
            {userRole === "teacher" && (
              <>
                <Route
                  path="/TeacherDashboard"
                  element={<TeacherDashboard />}
                />
                <Route
                  path="/teacher/attendance"
                  element={<ViewAttendance />}
                />
                <Route
                  path="/teacher/oldAttendance"
                  element={<OldAttendance />}
                />
                <Route
                  path="/teacher/viewAsignmentUi"
                  element={<ViewAssignmentUi />}
                />

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
                  path="/teacher/submittedTask/:assignmentId"
                  element={<SubmittedTask />}
                />
                <Route
                  path="/teacher/viewAllAssignments"
                  element={<ViewAllAssignmentTeacher />}
                />
                <Route
                  path="/teacher/viewSubmission"
                  element={<ViewSubmission />}
                />
              </>
            )}
            {(userRole === "teacher" &&
              window.location.pathname.startsWith("/admin")) ||
            (userRole === "teacher" &&
              window.location.pathname.startsWith("/student")) ||
            (userRole === "admin" &&
              window.location.pathname.startsWith("/student")) ||
            (userRole === "admin" &&
              window.location.pathname.startsWith("/teacher")) ? (
              <Route
                path="/*"
                element={<Navigate to="/AdminDashboard" replace />}
              />
            ) : (userRole === "student" &&
                window.location.pathname.startsWith("/teacher")) ||
              (userRole === "student" &&
                window.location.pathname.startsWith("/admin")) ? (
              <Route
                path="/*"
                element={<Navigate to="/StudentDashboard" replace />}
              />
            ) : (
              <Route path="/*" element={<Navigate to="/login" />} />
            )}
          </>
        ) : (
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
