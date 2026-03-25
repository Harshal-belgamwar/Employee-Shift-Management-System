// Mock data for development — replace with API calls later

export const currentUser = {
    id: 1,
    name: "Harsh Kumar",
    email: "harsh@shiftplanner.com",
    role: "manager", // "employee" | "manager" | "admin"
    avatar: null,
    department: "Engineering",
};

export const employees = [
    { id: 1, name: "Harsh Kumar", email: "harsh@shiftplanner.com", role: "manager", department: "Engineering", status: "active" },
    { id: 2, name: "Priya Sharma", email: "priya@shiftplanner.com", role: "employee", department: "Engineering", status: "active" },
    { id: 3, name: "Rahul Verma", email: "rahul@shiftplanner.com", role: "employee", department: "Operations", status: "active" },
    { id: 4, name: "Anita Das", email: "anita@shiftplanner.com", role: "employee", department: "Engineering", status: "active" },
    { id: 5, name: "Vikram Singh", email: "vikram@shiftplanner.com", role: "employee", department: "Support", status: "on_leave" },
    { id: 6, name: "Neha Gupta", email: "neha@shiftplanner.com", role: "employee", department: "Operations", status: "active" },
    { id: 7, name: "Arjun Patel", email: "arjun@shiftplanner.com", role: "admin", department: "HR", status: "active" },
    { id: 8, name: "Kavya Nair", email: "kavya@shiftplanner.com", role: "employee", department: "Support", status: "active" },
    { id: 9, name: "Deepak Reddy", email: "deepak@shiftplanner.com", role: "employee", department: "Engineering", status: "inactive" },
    { id: 10, name: "Meera Joshi", email: "meera@shiftplanner.com", role: "employee", department: "Operations", status: "active" },
];

export const shifts = [
    { id: 1, employeeId: 2, employeeName: "Priya Sharma", date: "2026-02-25", startTime: "09:00", endTime: "17:00", type: "Morning", department: "Engineering", status: "confirmed" },
    { id: 2, employeeId: 3, employeeName: "Rahul Verma", date: "2026-02-25", startTime: "14:00", endTime: "22:00", type: "Afternoon", department: "Operations", status: "confirmed" },
    { id: 3, employeeId: 4, employeeName: "Anita Das", date: "2026-02-25", startTime: "22:00", endTime: "06:00", type: "Night", department: "Engineering", status: "confirmed" },
    { id: 4, employeeId: 6, employeeName: "Neha Gupta", date: "2026-02-26", startTime: "09:00", endTime: "17:00", type: "Morning", department: "Operations", status: "pending" },
    { id: 5, employeeId: 8, employeeName: "Kavya Nair", date: "2026-02-26", startTime: "14:00", endTime: "22:00", type: "Afternoon", department: "Support", status: "confirmed" },
    { id: 6, employeeId: 2, employeeName: "Priya Sharma", date: "2026-02-27", startTime: "09:00", endTime: "17:00", type: "Morning", department: "Engineering", status: "confirmed" },
    { id: 7, employeeId: 10, employeeName: "Meera Joshi", date: "2026-02-27", startTime: "14:00", endTime: "22:00", type: "Afternoon", department: "Operations", status: "pending" },
    { id: 8, employeeId: 3, employeeName: "Rahul Verma", date: "2026-02-28", startTime: "09:00", endTime: "17:00", type: "Morning", department: "Operations", status: "confirmed" },
];

export const leaveRequests = [
    { id: 1, employeeId: 5, employeeName: "Vikram Singh", type: "Sick Leave", startDate: "2026-02-20", endDate: "2026-02-22", reason: "Flu and fever", status: "approved", appliedOn: "2026-02-19" },
    { id: 2, employeeId: 2, employeeName: "Priya Sharma", type: "Casual Leave", startDate: "2026-03-01", endDate: "2026-03-02", reason: "Personal work", status: "pending", appliedOn: "2026-02-24" },
    { id: 3, employeeId: 6, employeeName: "Neha Gupta", type: "Vacation", startDate: "2026-03-10", endDate: "2026-03-15", reason: "Family trip", status: "pending", appliedOn: "2026-02-23" },
    { id: 4, employeeId: 4, employeeName: "Anita Das", type: "Sick Leave", startDate: "2026-02-15", endDate: "2026-02-16", reason: "Doctor appointment", status: "approved", appliedOn: "2026-02-14" },
    { id: 5, employeeId: 8, employeeName: "Kavya Nair", type: "Casual Leave", startDate: "2026-02-18", endDate: "2026-02-18", reason: "Personal errands", status: "rejected", appliedOn: "2026-02-16" },
];

export const swapRequests = [
    { id: 1, requesterId: 2, requesterName: "Priya Sharma", targetId: 4, targetName: "Anita Das", shiftDate: "2026-02-28", shiftTime: "09:00 - 17:00", reason: "Doctor appointment", status: "pending" },
    { id: 2, requesterId: 6, requesterName: "Neha Gupta", targetId: 10, targetName: "Meera Joshi", shiftDate: "2026-02-27", shiftTime: "09:00 - 17:00", reason: "Family event", status: "pending" },
    { id: 3, requesterId: 8, requesterName: "Kavya Nair", targetId: 3, targetName: "Rahul Verma", shiftDate: "2026-02-26", shiftTime: "14:00 - 22:00", reason: "Transportation issue", status: "approved" },
];

export const availability = [
    { day: "Monday", slots: [{ start: "09:00", end: "17:00", available: true }, { start: "17:00", end: "22:00", available: false }] },
    { day: "Tuesday", slots: [{ start: "09:00", end: "17:00", available: true }, { start: "17:00", end: "22:00", available: true }] },
    { day: "Wednesday", slots: [{ start: "09:00", end: "17:00", available: true }, { start: "17:00", end: "22:00", available: false }] },
    { day: "Thursday", slots: [{ start: "09:00", end: "17:00", available: false }, { start: "17:00", end: "22:00", available: true }] },
    { day: "Friday", slots: [{ start: "09:00", end: "17:00", available: true }, { start: "17:00", end: "22:00", available: true }] },
    { day: "Saturday", slots: [{ start: "09:00", end: "17:00", available: false }, { start: "17:00", end: "22:00", available: false }] },
    { day: "Sunday", slots: [{ start: "09:00", end: "17:00", available: false }, { start: "17:00", end: "22:00", available: false }] },
];

export const notifications = [
    { id: 1, message: "Your shift on Feb 28 has been confirmed", time: "2 hours ago", read: false, type: "info" },
    { id: 2, message: "Leave request from Priya Sharma is pending", time: "5 hours ago", read: false, type: "warning" },
    { id: 3, message: "Shift swap approved for Kavya Nair", time: "1 day ago", read: true, type: "success" },
    { id: 4, message: "New schedule generated for week of Mar 1", time: "2 days ago", read: true, type: "info" },
];

export const departments = ["Engineering", "Operations", "Support", "HR", "Finance"];

export const shiftTypes = [
    { name: "Morning", startTime: "09:00", endTime: "17:00", color: "#f59e0b" },
    { name: "Afternoon", startTime: "14:00", endTime: "22:00", color: "#6366f1" },
    { name: "Night", startTime: "22:00", endTime: "06:00", color: "#8b5cf6" },
];
