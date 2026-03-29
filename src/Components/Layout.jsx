import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

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
    const [userdata, setUserData] = useState({
        username: "",
        role: ""
    });
    const location = useLocation();

    const fetchUser = async () => {
        try {
            const resp = await api.get("/auth/me");
            const data = resp.data;
            if (data.role) {
                data.role = data.role.substring(5).toLowerCase();
            }
            setUserData(data);
        } catch (error) {
            // Not necessarily an error if not logged in, but Layout is usually for logged in users
            console.error("Failed to fetch user in Layout", error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

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
                <Navbar pageTitle={pageTitle} collapsed={collapsed} userdata={userdata} />
                <div className="page-wrapper">{children}</div>
            </div>
        </div>
    );
}
