import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { toast } from "react-toastify";

let listenerInitialized = false;
export const listenForMessages = () => {
    if (listenerInitialized) return; // 🔥 prevents duplicates

    listenerInitialized = true;
    onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);

        const title = payload?.notification?.title || payload?.data?.title;
        const body = payload?.notification?.body || payload?.data?.body;

        if (title) {
            toast.info(`${title}: ${body || ""}`, { autoClose: 10000 });
        }
    });
};