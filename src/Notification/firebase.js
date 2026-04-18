import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";



const firebaseConfig = {
  apiKey: "AIzaSyAzkKWFJPXqZmRfrM7KeiLI1lxV_C3YNaE",
  authDomain: "notification-f7b9f.firebaseapp.com",
  projectId: "notification-f7b9f",
  messagingSenderId: "498322386513",
  appId: "1:498322386513:web:830da91479e20f3cd71270"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
