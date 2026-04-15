import { Routes, Route } from "react-router-dom";

// Auth
import LoginPage from "../Pages/LoginPage";
import ForgotPassword from "../Pages/ForgetPassword";

// Protected wrapper
import ProtectedRoutes from "./ProtectedRoutes";

// Employee Pages
import EmployeeDashboard from "../Pages/Employee/EmployeeDashboard";
import MyShifts from "../Pages/Employee/MyShifts";
import Availability from "../Pages/Employee/Availability";
import LeaveRequests from "../Pages/Employee/LeaveRequests";
import ShiftRequestHistory from "../Pages/Employee/ShiftRequestHistory";
import ShiftPreference from "../Pages/Employee/ShiftPreference";

// Manager Pages
import ManagerDashboard from "../Pages/Manager/ManagerDashboard";
import ScheduleGenerator from "../Pages/Manager/ScheduleGenerator";
import RequestApprovals from "../Pages/Manager/RequestApprovals";

// Admin Pages
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import UserManagement from "../Pages/Admin/UserManagement";
import AddUser from "../Pages/Admin/Users/AddUser";
import EmployeeManagement from "../Pages/Admin/EmployeeManagement";
import AddEmployees from "../Pages/Admin/Employee/AddEmployees";
import ShiftManagement from "../Pages/Admin/ShiftManagement";
import ViewLeaveRequest from "../Pages/Admin/ViewLeaveRequest";
import ViewShiftChangeRequest from "../Pages/Admin/ViewShiftChangeRequest";

// Common
import Scheduler from "../Pages/Scheduler";
import Error404 from "../Pages/404";

export default function AppRoutes() {
    return (
        <Routes>
            {/*  Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/forget-password" element={<ForgotPassword />} />

            {/*  Protected Routes */}
            <Route element={<ProtectedRoutes />}>
                
                {/* Employee */}
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee/my-shifts" element={<MyShifts />} />
                <Route path="/employee/availability" element={<Availability />} />
                <Route path="/employee/leave-requests" element={<LeaveRequests />} />
                <Route path="/employee/shift-requests" element={<ShiftRequestHistory />} />
                <Route path="/employee/shift-preference" element={<ShiftPreference />} />

                {/* Manager */}
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/schedule" element={<ScheduleGenerator />} />
                <Route path="/manager/approvals" element={<RequestApprovals />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/shift-management" element={<ShiftManagement />} />

                {/* Common */}
                <Route path="/employee-management" element={<EmployeeManagement />} />
                <Route path="/addEmployee" element={<AddEmployees />} />
                <Route path="/addusers" element={<AddUser />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/view-leave-requests" element={<ViewLeaveRequest />} />
                <Route path="/shift-change-requests" element={<ViewShiftChangeRequest />} />
                <Route path="/scheduler" element={<Scheduler />} />

            </Route>

            {/*  404 */}
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
}