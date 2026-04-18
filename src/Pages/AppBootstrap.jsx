import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../Auth/checkAuth";
import { getDashboardPath } from "../Pages/getDashBoardPath";

export default function AppBootstrap() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const user = await checkAuth();

            if (user) {
                const path = getDashboardPath(user.role);
                navigate(path, { replace: true });
            } else {
                navigate("/", { replace: true }); // login page
            }

            setLoading(false);
        };

        init();
    }, []);

    if (loading) return null;

    return null;
}