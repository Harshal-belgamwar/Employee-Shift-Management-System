import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employees as mockEmployees } from "../../utils/mockData";
import api from "../../utils/api";

import { toast } from "react-toastify";
import UpdateEmployee from "./Employee/updateEmployee";


const roleConfig = {
    admin: {
        label: "Admin",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-600",
        badgeBorder: "border-amber-200",
        avatarGradient: "from-amber-400 to-orange-500",
    },
    manager: {
        label: "Manager",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-600",
        badgeBorder: "border-blue-200",
        avatarGradient: "from-blue-400 to-indigo-500",
    },
    employee: {
        label: "Employee",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-600",
        badgeBorder: "border-emerald-200",
        avatarGradient: "from-emerald-400 to-teal-500",
    },
};

const statusConfig = {
    active: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-500" },
    OnLeave: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500" },
    Inactive: { bg: "bg-red-50", text: "text-red-500", border: "border-red-200", dot: "bg-red-400" },
};

const inputClass =
    "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition";

const labelClass = "block text-sm font-semibold text-slate-600 mb-2";

export default function EmployeeManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState(mockEmployees);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);

    const [search, setSearch] = useState("");


    const [form, setForm] = useState({
        name: "", email: "", role: "", department: "", status: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const USERS_PER_PAGE = 10;

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            (u.username || "").toLowerCase().includes((search || "").toLowerCase());

        return matchesSearch;
    });




    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const openAdd = () => {
        // setEditUser(null);
        // setForm({ name: "", email: "", role: "employee", department: "Engineering", status: "active" });
        // setShowModal(true);
        navigate("/addEmployee");
    };

    const openEdit = async (user) => {

        setEditUser(user);
        setShowModal(true);
    };

    const closeModel = () => {
        setShowModal(false);
        setEditUser(null);
    };

    const [userdata, setUserData] = useState({
        username: "",
        role: ""
    })

    const fetchUser = async () => {
        try {
            const resp = await api.get("/auth/me");
            console.log(resp.data);
            setUserData(resp.data);

        } catch (error) {
            toast.error(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])


    const username = userdata.username;
    const role = userdata?.role?.substring(5).trim().toLowerCase();
    console.log(role);




    const confirmDelete = async () => {


        try {
            await api.delete(`/admin/employees/${deleteUser.username}`);
            toast.success("User deleted successfully!");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }


        setUsers(users.filter((u) => u.username !== deleteUser.username));
        setShowDeleteModal(false);
        setDeleteUser(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteUser(null);
    };


    const fetchUsers = async () => {
        try {

            if (role === "manager") {
                console.log(role === "admin");
                const response = await api.get(`/admin/users/${username}`);
                setUsers(response.data);
                console.log(response.data);
            } else {


                const response = await api.get(`/admin/users`);
                setUsers(response.data);
                console.log(response.data);

            }

        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [showModal]);







    const handleDelete = (user) => {
        setDeleteUser(user);
        setShowDeleteModal(true);
    };


    const roleCounts = {
        admin: users.filter((u) => u.role === "Admin").length,
        manager: users.filter((u) => u.role === "Manager").length,
        employee: users.filter((u) => u.role === "Employee").length,
    };

    return (
        <div
            className="min-h-screen bg-[#f8f7fc] px-6 py-10"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
            <div className="max-w-6xl mx-auto flex flex-col gap-7">

                {/* ── Back Button ── */}
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl 
        bg-purple-600 text-white text-sm font-semibold 
        hover:bg-purple-700 active:bg-purple-800 
        border border-purple-600 shadow-sm 
        transition-all duration-200"
                        title="Back to Dashboard"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back
                    </button>
                </div>

                {/* ── Header ── */}
                <div className="flex items-center justify-between flex-wrap gap-4 rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-violet-50 px-8 py-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-300/40 shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Employee Management
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Manage employee accounts and personal details
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 active:scale-[0.98] transition shadow-md shadow-purple-300/40"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Employee
                    </button>
                </div>

                {/* ── Summary Cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total Users", value: users.length, icon: "👥", bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-600" },
                        { label: "Admins", value: roleCounts.admin, icon: "🛡️", bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600" },
                        { label: "Managers", value: roleCounts.manager, icon: "👔", bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600" },
                        { label: "Employees", value: roleCounts.employee, icon: "👤", bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
                    ].map((card, i) => (
                        <div key={i} className={`${card.bg} border ${card.border} rounded-2xl px-5 py-4 flex items-center gap-4`}>
                            <span className="text-2xl">{card.icon}</span>
                            <div>
                                <p className={`text-xl font-extrabold ${card.text}`}>{card.value}</p>
                                <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filters ── */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[220px] max-w-sm">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                        />
                    </div>


                </div>

                {/* ── Table ── */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">

                            {/* Header */}
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70">
                                    <th className="w-[40%] px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                                        Username
                                    </th>
                                    <th className="w-[20%] px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                                        Role
                                    </th>

                                    <th className="w-[20%] px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                                        Status
                                    </th>
                                    <th className="w-[20%] px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-14 text-slate-400 text-sm">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-3xl">🔍</span>
                                                <span className="font-medium">No users found</span>
                                                <span className="text-xs text-slate-300">
                                                    Try adjusting your search or filter
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    currentUsers.map((user) => {
                                        const Role = roleConfig[user.role] || roleConfig.employee;
                                        const status = statusConfig[user.status] || statusConfig.active;

                                        return (
                                            <tr
                                                key={user.employeeId}
                                                className="hover:bg-slate-50/60 transition-colors duration-150 group"
                                            >

                                                {/* User */}
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`w-8 h-8 rounded-xl bg-gradient-to-br ${Role.avatarGradient} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                                                        >
                                                            {(user.username || "U").charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-slate-800 text-sm">
                                                            {user.username || "Unknown User"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Role */}
                                                <td className="px-6 py-3">
                                                    <span
                                                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${role.badgeBg} ${role.badgeText} ${role.badgeBorder}`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-3">
                                                    {(() => {
                                                        // Map status to config (default to active if unknown)
                                                        const status = statusConfig[user.status] || statusConfig.active;

                                                        return (
                                                            <span
                                                                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.bg} ${status.text} ${status.border}`}
                                                            >
                                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                                {user.status.replace("_", " ")}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity duration-150">

                                                        {/* Edit */}
                                                        {user.role !== "Admin" && <button
                                                            onClick={() => openEdit(user)}
                                                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-purple-600 bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors"
                                                        >
                                                            Edit
                                                        </button>}

                                                        {/* Delete */}
                                                     
                                                        {role === "admin" && <button
                                                            onClick={() => handleDelete(user)}
                                                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                                                        >
                                                            Delete
                                                        </button>}

                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                        <span className="text-xs text-slate-400 font-medium">
                            Showing{" "}
                            <span className="text-slate-600 font-semibold">
                                {filteredUsers.length > 0 ? startIndex + 1 : 0}
                            </span>{" "}
                            of{" "}
                            <span className="text-slate-600 font-semibold">
                                {Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length)}
                            </span>{" "}
                            pages

                        </span>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-purple-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-500 disabled:cursor-not-allowed transition-colors"
                                    title="Previous Page"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <span className="text-xs font-semibold text-slate-600 px-2 min-w-[5rem] text-center">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-purple-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-500 disabled:cursor-not-allowed transition-colors"
                                    title="Next Page"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <UpdateEmployee employee={editUser} closeModal={closeModel} />
                )}



                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                        {/* Modal box only */}
                        <div className="relative bg-white rounded-2xl p-6 w-80 max-w-sm shadow-xl border border-gray-100 pointer-events-auto">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h2>
                            <p className="text-sm text-gray-500 mb-5">
                                Are you sure you want to delete this user? This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
}