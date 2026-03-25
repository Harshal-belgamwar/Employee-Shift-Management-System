import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-start py-2.5 border-b border-white/5 last:border-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-slate-500 shrink-0 mr-4">
                {label}
            </span>
            <span className="text-[13px] text-slate-300 text-right break-words">
                {value || <span className="text-slate-600">—</span>}
            </span>
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-indigo-400">{icon}</span>
                <h3 className="text-[13.5px] font-bold text-slate-200 tracking-tight">{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default function Profile({ handleBack }) {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const username = sessionStorage.getItem("username");
                const res = await api.get(`/employee/profile/${username}`);
                setEmployee(res.data);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-indigo-400 text-sm">Loading profile…</p>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-red-400 text-sm">No profile found</p>
            </div>
        );
    }

    const manager = employee.manager;

    const fullName = [employee.employeeFname, employee.employeeMname, employee.employeeLname]
        .filter(Boolean)
        .join(" ");

    const initials = [employee.employeeFname, employee.employeeLname]
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const managerInitials = manager
        ? [manager.employeeFname, manager.employeeLname]
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : null;

    const isActive = employee.status?.toLowerCase() === "active";

    return (
        <div className="h-[80vh] overflow-y-auto overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-6 py-8">

                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-indigo-300 bg-white/5 hover:bg-white/10 border border-indigo-400/20 rounded-xl px-4 py-2 text-[13px] font-medium mb-7 transition-colors cursor-pointer"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </button>

                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-5 flex flex-wrap items-center gap-6">

                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg shadow-indigo-500/20">
                        {initials || "?"}
                    </div>

                    <div className="flex-1 min-w-[180px]">
                        <h1 className="text-xl font-bold text-slate-100 mb-1">
                            {fullName || "—"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[13px] text-indigo-300">@{employee.username || "—"}</span>
                            <span className="text-slate-600 text-sm">·</span>
                            <span className="text-[13px] text-slate-400">{employee.designation || "No Designation"}</span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${isActive
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                                : "bg-red-500/10 text-red-400 border-red-500/25"
                                }`}>
                                {employee.status || "Unknown"}
                            </span>
                        </div>
                        <p className="text-[12px] text-slate-500">{employee.employeeEmail || "No email"}</p>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/25 rounded-xl px-4 py-2 text-center">
                        <p className="text-[10px] font-bold uppercase text-indigo-400 mb-1">Role</p>
                        <p className="text-[14px] font-semibold text-indigo-300">{employee.role || "—"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Section title="Personal Info" icon={
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    }>
                        <InfoRow label="Full Name" value={fullName} />
                        <InfoRow label="Username" value={employee.username} />
                        <InfoRow label="Email" value={employee.employeeEmail} />
                        <InfoRow label="Gender" value={employee.gender} />
                        <InfoRow label="Contact" value={employee.contactNo} />
                    </Section>

                    <Section title="Job Info" icon={
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    }>
                        <InfoRow label="Designation" value={employee.designation} />
                        <InfoRow label="Role" value={employee.role} />
                        <InfoRow label="Status" value={employee.status} />
                    </Section>

                    <Section title="Address" icon={
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" />
                            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                    }>
                        <InfoRow label="Permanent" value={employee.permanentAddress} />
                        <InfoRow label="Temporary" value={employee.tempAddress} />
                    </Section>

                    <Section title="Reporting Manager" icon={
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    }>
                        {manager ? (
                            <>
                                <div className="flex items-center gap-3 py-2.5 border-b border-white/5 mb-1">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[13px] font-bold text-white">
                                        {managerInitials || "M"}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-200">
                                            {manager.employeeFname} {manager.employeeLname}
                                        </p>
                                        <p className="text-[11px] text-slate-500">{manager.designation}</p>
                                    </div>
                                </div>
                                <InfoRow label="Email" value={manager.employeeEmail} />
                                <InfoRow label="Contact" value={manager.contactNo} />
                                <InfoRow label="Designation" value={manager.designation} />
                            </>
                        ) : (
                            <p className="text-slate-500">No manager assigned</p>
                        )}
                    </Section>

                </div>
            </div>
        </div>
    );
}