importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');
// import { onMessage } from "firebase/messaging";
// import { messaging } from "./firebase";


firebase.initializeApp({
  apiKey: "AIzaSyAzkKWFJPXqZmRfrM7KeiLI1lxV_C3YNaE",
  projectId: "notification-f7b9f",
  messagingSenderId: "498322386513",
  appId: "1:498322386513:web:830da91479e20f3cd71270"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Background message received: ", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/logo.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// messaging.onMessage(messaging, (payload) => {
//   console.log("Message received: ", payload);

//   // Show notification manually
//   new Notification(payload.notification.title, {
//     body: payload.notification.body
//   });
// });

