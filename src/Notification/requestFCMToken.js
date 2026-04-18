import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

export const requestFCMToken = async () => {

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        return null;
    }
    try {
        const token = await getToken(messaging, {
            vapidKey: "BDzd5EbbcbaBBB0xWQDYbm2Xvbw8zwvB1na7Fz5IisV_Jj7p38qQB3mKcEtW6Y9lP3GEgb0TK5Y_x7R_wgjoizs"
        });

        if (token) {
            console.log("FCM Token:", token);
            return token;
        } else {
            console.log("No registration token available");
        }
    } catch (error) {
        console.log("Error getting token:", error);
        return null;
    }
};