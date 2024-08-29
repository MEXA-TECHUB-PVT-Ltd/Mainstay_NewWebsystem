importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

//the Firebase config object 
const firebaseConfig = {
  apiKey: "AIzaSyDgSznHpVwobCeRajlNV7Kd3wzzhdx7q50",
  authDomain: "gtcaptionsignals.firebaseapp.com",
  projectId: "gtcaptionsignals",
  storageBucket: "gtcaptionsignals.appspot.com",
  messagingSenderId: "977631800678",
  appId: "1:977631800678:web:b245b2718a0409ea5b6ca7",
  // measurementId: "G-MRGJW3J35C"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
}); 