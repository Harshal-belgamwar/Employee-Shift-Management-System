export const getDashboardPath = (role) => {
    const r = role?.substring(5)?.toLowerCase();

    switch (r) {
        case "admin":
            return "/admin/dashboard";

        case "employee":
        case "manager":
            return "/employee/dashboard";

        default:
            return "/";
    }
};