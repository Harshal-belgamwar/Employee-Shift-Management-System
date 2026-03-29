import { useState, useRef, useEffect } from "react";
import { notifications as mockNotifications } from "../utils/mockData";
import { useNavigate } from "react-router-dom";



export default function Navbar({ pageTitle = "Dashboard", onOpenProfile, onOpenPasswordModal, userdata }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const displayName = userdata?.username || sessionStorage.getItem("username") || "User";
    const displayRole = userdata?.role || sessionStorage.getItem("role") || "";




    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const unreadCount = mockNotifications.filter((n) => !n.read).length;
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("username");
        navigate("/");
    };

    return (
        <header className="fixed top-0 left-0 w-full h-16 z-20 flex items-center justify-between px-6 
            bg-slate-900/80 backdrop-blur-md border-b border-slate-700">

            {/* Title */}
            <h2 className="text-xl font-semibold text-white tracking-wide">
                {pageTitle}
            </h2>

            {/* Right Side */}
            <div className="flex items-center gap-4">

                {/* Search */}
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-56 pl-9 pr-3 py-2 rounded-lg bg-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>
                </div>



                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800"
                    >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden sm:block text-sm text-slate-300">
                            {displayName}
                        </span>
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-lg">
                            <div className="px-4 py-3 border-b border-slate-700">
                                <p className="text-sm text-white font-medium">{displayName}</p>
                                <p className="text-xs text-slate-400">{displayRole}</p>
                            </div>

                            <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800" onClick={onOpenProfile}>
                                Profile Settings
                            </button>

                            <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800" onClick={onOpenPasswordModal}>
                                change Password
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10" onClick={() => handleLogout()}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}