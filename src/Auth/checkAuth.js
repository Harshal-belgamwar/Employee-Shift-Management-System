import api from "../utils/api";

export const checkAuth = async () => {
    try {
        const res = await api.get("/auth/me");
        return res.data; // user object
    } catch (err) {
        return null;
    }
};