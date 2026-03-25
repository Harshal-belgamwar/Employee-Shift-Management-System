import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import LoginPage from "../Pages/LoginPage";

// Employee Pages
import EmployeeDashboard from "../Pages/Employee/EmployeeDashboard";
import MyShifts from "../Pages/Employee/MyShifts";
import Availability from "../Pages/Employee/Availability";
import LeaveRequests from "../Pages/Employee/LeaveRequests";
import ShiftSwap from "../Pages/Employee/ShiftSwap";

// Manager Pages
import ManagerDashboard from "../Pages/Manager/ManagerDashboard";
import ScheduleGenerator from "../Pages/Manager/ScheduleGenerator";
import RequestApprovals from "../Pages/Manager/RequestApprovals";
import TeamView from "../Pages/Manager/TeamView";

// Admin Pages
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import UserManagement from "../Pages/Admin/UserManagement";
import SystemSettings from "../Pages/Admin/SystemSettings";
import ForgotPassword from "../Pages/ForgetPassword";
import AddUser from "../Pages/Admin/Users/AddUser";
import EmployeeManagement from "../Pages/Admin/EmployeeManagement";
import AddEmployees from "../Pages/Admin/Employee/AddEmployees";
import ShiftManagement from "../Pages/Admin/ShiftManagement";
import ShiftRequestHistory from "../Pages/Employee/ShiftRequestHistory";
import ViewLeaveRequest from "../Pages/Admin/ViewLeaveRequest";
import ViewShiftChangeRequest from "../Pages/Admin/ViewShiftChangeRequest";
import ShiftPreference from "../Pages/Employee/ShiftPreference";
import Scheduler from "../Pages/Scheduler";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forget-password" element={<ForgotPassword />} />

            {/* Employee Routes */}
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/my-shifts" element={<MyShifts />} />
            <Route path="/employee/availability" element={<Availability />} />
            <Route path="/employee/leave-requests" element={<LeaveRequests />} />
            <Route path="/employee/shift-swap" element={<ShiftSwap />} />
            <Route path="/employee/shift-requests" element={<ShiftRequestHistory />} />
            <Route path="/employee/shift-preference" element={<ShiftPreference />} />

            {/* Manager Routes */}
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/schedule" element={<ScheduleGenerator />} />
            <Route path="/manager/approvals" element={<RequestApprovals />} />
            <Route path="/manager/team" element={<TeamView />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/shift-management" element={<ShiftManagement />} />

            {/* common routes */}
            <Route path="/employee-management" element={<EmployeeManagement />} />
            <Route path="/addEmployee" element={<AddEmployees />} />
            <Route path="/addusers" element={<AddUser />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/view-leave-requests" element={<ViewLeaveRequest />} />
            <Route path="/shift-change-requests" element={<ViewShiftChangeRequest />} />

            <Route path="/scheduler" element={<Scheduler />} />
        </Routes>
    );
}
