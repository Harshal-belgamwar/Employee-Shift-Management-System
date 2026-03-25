import { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";

function XIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function ResetIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
}

function SaveIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

const statusConfig = {
    Active: { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    Inactive: { dot: "bg-red-400", badge: "bg-red-50 text-red-700 border-red-200" },
    OnLeave: { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" },
};

const fieldClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200";
const labelClass = "block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1.5";

export default function UpdateEmployee({ employee, closeModal }) {
    const [form, setForm] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setFetching(true);
                const res = await api.get(`/admin/employees/${employee.username}`);
                if (res.data) {
                    const formatted = {
                        ...res.data,
                        joinDate: res.data.joinDate ? res.data.joinDate.split("T")[0] : "",
                        endDate: res.data.endDate ? res.data.endDate.split("T")[0] : "",
                    };
                    setForm(formatted);
                    setOriginalData(formatted);
                }
            } catch {
                toast.error("Failed to load employee data");
            } finally {
                setFetching(false);
            }
        };
        if (employee?.username) fetchEmployee();
    }, [employee]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleReset = () => setForm(originalData);

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put(`/admin/employees`, form);
            toast.success("Employee updated successfully!");
            closeModal();
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const currentStatus = form.status || "Active";
    const statusStyle = statusConfig[currentStatus] || statusConfig.Active;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-6"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header band */}
                <div className="bg-gradient-to-br from-purple-600 to-violet-700 px-6 pt-6 pb-8 shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 text-white">
                                <UserIcon />
                            </div>
                            <div>
                                <p className="text-purple-200 text-xs font-semibold tracking-widest uppercase">
                                    Employee Management
                                </p>
                                <h2 className="text-white text-xl font-bold leading-tight">
                                    Update Employee
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={closeModal}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors duration-150"
                        >
                            <XIcon />
                        </button>
                    </div>
                </div>

                {/* Employee chip — overlaps header */}
                <div className="-mt-4 px-6 shrink-0">
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                        <span className="text-xs text-slate-500 font-medium">
                            {form.employeeFname
                                ? `${form.employeeFname} ${form.employeeLname || ""}`.trim()
                                : employee?.username}
                        </span>

                    </div>
                </div>

                {/* Scrollable form area */}
                <div className="overflow-y-auto flex-1 px-6 pt-4 pb-2">

                    {fetching ? (
                        <div className="flex items-center justify-center py-16">
                            <svg className="w-6 h-6 animate-spin text-purple-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span className="ml-3 text-sm text-slate-400">Loading employee data…</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">

                            {/* Section: Personal Info */}
                            <div className="md:col-span-2 flex items-center gap-2 pt-1 pb-0.5">
                                <span className="text-xs font-bold tracking-widest uppercase text-purple-500">Personal Info</span>
                                <div className="flex-1 h-px bg-purple-100" />
                            </div>

                            <div>
                                <label className={labelClass}>First Name</label>
                                <input name="employeeFname" value={form.employeeFname || ""} onChange={handleChange} placeholder="First name" className={fieldClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Middle Name</label>
                                <input name="employeeMname" value={form.employeeMname || ""} onChange={handleChange} placeholder="Middle name" className={fieldClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Last Name</label>
                                <input name="employeeLname" value={form.employeeLname || ""} onChange={handleChange} placeholder="Last name" className={fieldClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Gender</label>
                                <select name="gender" value={form.gender || ""} onChange={handleChange} className={fieldClass}>
                                    <option value="">Select gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>

                            {/* Section: Contact */}
                            <div className="md:col-span-2 flex items-center gap-2 pt-2 pb-0.5">
                                <span className="text-xs font-bold tracking-widest uppercase text-purple-500">Contact</span>
                                <div className="flex-1 h-px bg-purple-100" />
                            </div>

                            <div>
                                <label className={labelClass}>Email</label>
                                <input type="email" name="employeeEmail" value={form.employeeEmail || ""} onChange={handleChange} placeholder="email@example.com" className={fieldClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Contact No</label>
                                <input name="contactNo" value={form.contactNo || ""} onChange={handleChange} placeholder="+1 000 000 0000" className={fieldClass} />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Permanent Address</label>
                                <input name="permanentAddress" value={form.permanentAddress || ""} onChange={handleChange} placeholder="Permanent address" className={fieldClass} />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Temporary Address</label>
                                <input name="tempAddress" value={form.tempAddress || ""} onChange={handleChange} placeholder="Temporary address" className={fieldClass} />
                            </div>

                            {/* Section: Employment */}
                            <div className="md:col-span-2 flex items-center gap-2 pt-2 pb-0.5">
                                <span className="text-xs font-bold tracking-widest uppercase text-purple-500">Employment</span>
                                <div className="flex-1 h-px bg-purple-100" />
                            </div>

                            <div>
                                <label className={labelClass}>Designation</label>
                                <input name="designation" value={form.designation || ""} onChange={handleChange} placeholder="e.g. Software Engineer" className={fieldClass} />
                            </div>



                            <div>
                                <label className={labelClass}>Join Date</label>
                                <input type="date" name="joinDate" value={form.joinDate || ""} onChange={handleChange} className={fieldClass} />
                            </div>

                            <div>
                                <label className={labelClass}>End Date</label>
                                <input type="date" name="endDate" value={form.endDate || ""} onChange={handleChange} className={fieldClass} />
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-all duration-150"
                    >
                        <ResetIcon />
                        Reset
                    </button>
                    <button
                        onClick={closeModal}
                        className="px-4 py-2.5 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-all duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || fetching}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Saving…
                            </>
                        ) : (
                            <>
                                <SaveIcon />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}