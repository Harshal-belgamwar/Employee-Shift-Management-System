import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const inputClass =
    "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition";

const labelClass = "block text-sm font-semibold text-slate-600 mb-2";

const sectionClass =
    "bg-white border border-slate-200 rounded-3xl p-8 shadow-sm";

export default function AddEmployee() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        employeeFname: "",
        employeeMname: "",
        employeeLname: "",
        employeeEmail: "",
        gender: "",
        contactNo: "",
        permanentAddress: "",
        tempAddress: "",
        designation: "",
        joinDate: "",
        endDate: "",
        managerUsername: "",
    });

    const [sameAddress, setSameAddress] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "permanentAddress" && sameAddress) {
                updated.tempAddress = value;
            }
            return updated;
        });
    };

    const handleSameAddress = (e) => {
        setSameAddress(e.target.checked);
        if (e.target.checked) {
            setForm((prev) => ({ ...prev, tempAddress: prev.permanentAddress }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = { ...form, endDate: form.endDate || null };
        try {
            console.log("Submitting:", payload);
            await api.post("/admin/employees", payload);
            toast.success("Employee added successfully!");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to add employee");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm({
            employeeFname: "",
            employeeMname: "",
            employeeLname: "",
            employeeEmail: "",
            gender: "",
            contactNo: "",
            permanentAddress: "",
            tempAddress: "",
            designation: "",
            joinDate: "",
            endDate: "",
            managerUsername: "",
        });
        setSameAddress(false);
    };




    return (
        <div
            className="min-h-screen bg-[#f8f7fc]"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
            <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-7">

                {/* Page Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-300/40">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Add New Employee
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Fill in the details to register a new team member
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* ── Personal Information ── */}
                    <div className={sectionClass}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 flex items-center justify-center text-purple-500 shrink-0">
                                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-700">Personal Information</h3>
                                <p className="text-xs text-slate-400">Basic identity details of the employee</p>
                            </div>
                        </div>

                        {/* Name row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                            <div>
                                <label className={labelClass}>
                                    First Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="employeeFname"
                                    value={form.employeeFname}
                                    onChange={handleChange}
                                    placeholder="Vikram"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Middle Name</label>
                                <input
                                    type="text"
                                    name="employeeMname"
                                    value={form.employeeMname}
                                    onChange={handleChange}
                                    placeholder="S"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Last Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="employeeLname"
                                    value={form.employeeLname}
                                    onChange={handleChange}
                                    placeholder="Kumar"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Email + Gender + Contact */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        name="employeeEmail"
                                        value={form.employeeEmail}
                                        onChange={handleChange}
                                        placeholder="vikram@company.com"
                                        required
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Gender <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    required
                                    className={`${inputClass} cursor-pointer`}
                                >
                                    <option value="" disabled>Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Contact No <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="tel"
                                        name="contactNo"
                                        value={form.contactNo}
                                        onChange={handleChange}
                                        placeholder="9000000011"
                                        maxLength={10}
                                        required
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Address Details ── */}
                    <div className={sectionClass}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 flex items-center justify-center text-purple-500 shrink-0">
                                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-700">Address Details</h3>
                                <p className="text-xs text-slate-400">Permanent and temporary residence</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    Permanent Address <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="permanentAddress"
                                    value={form.permanentAddress}
                                    onChange={handleChange}
                                    placeholder="Enter permanent address"
                                    rows={3}
                                    required
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-slate-600">
                                        Temporary Address
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sameAddress}
                                            onChange={handleSameAddress}
                                            className="accent-purple-600 w-3.5 h-3.5"
                                        />
                                        <span className="text-xs text-slate-500">Same as permanent</span>
                                    </label>
                                </div>
                                <textarea
                                    name="tempAddress"
                                    value={form.tempAddress}
                                    onChange={handleChange}
                                    placeholder="Enter temporary address"
                                    rows={3}
                                    disabled={sameAddress}
                                    className={`${inputClass} resize-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Employment Details ── */}
                    <div className={sectionClass}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 flex items-center justify-center text-purple-500 shrink-0">
                                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-700">Employment Details</h3>
                                <p className="text-xs text-slate-400">Role, dates, and reporting information</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className={labelClass}>
                                    Designation <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={form.designation}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Engineer"
                                        required
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Manager Username <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        name="managerUsername"
                                        value={form.managerUsername}
                                        onChange={handleChange}
                                        placeholder="e.g. priya.mehta"
                                        required
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    Join Date <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="date"
                                        name="joinDate"
                                        value={form.joinDate}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    End Date{" "}
                                    <span className="text-slate-400 font-normal text-xs">(optional)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={form.endDate}
                                        onChange={handleChange}
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex items-center justify-end gap-3 pb-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 transition active:scale-[0.98]"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={handleSubmit}
                            className="px-7 py-3 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 active:scale-[0.98] disabled:opacity-60 transition shadow-md shadow-purple-300/40"
                        >
                            {loading ? "Adding..." : "Add Employee"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}