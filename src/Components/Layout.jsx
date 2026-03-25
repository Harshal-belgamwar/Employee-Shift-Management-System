import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const pageTitles = {
    "/employee/dashboard": "Employee Dashboard",
    "/employee/my-shifts": "My Shifts",
    "/employee/availability": "Availability",
    "/employee/leave-requests": "Leave Requests",
    "/employee/shift-swap": "Shift Swap",
    "/manager/dashboard": "Manager Dashboard",
    "/manager/schedule": "Schedule Generator",
    "/manager/approvals": "Request Approvals",
    "/manager/team": "Team View",
    "/admin/dashboard": "Admin Dashboard",
    "/admin/users": "User Management",
    "/admin/settings": "System Settings",
};

export default function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    // Determine role from path
    const pathParts = location.pathname.split("/");
    const role = pathParts[1] || "employee";
    const pageTitle = pageTitles[location.pathname] || "ShiftPlanner";

    return (
        <div className="app-layout">
            <Sidebar
                role={role}
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
            />
            <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
                <Navbar pageTitle={pageTitle} collapsed={collapsed} />
                <div className="page-wrapper">{children}</div>
            </div>
        </div>
    );
}
