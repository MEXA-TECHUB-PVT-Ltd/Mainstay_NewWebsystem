import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const firebaseConfig = {
    apiKey: "AIzaSyDgSznHpVwobCeRajlNV7Kd3wzzhdx7q50",
    authDomain: "gtcaptionsignals.firebaseapp.com",
    projectId: "gtcaptionsignals",
    storageBucket: "gtcaptionsignals.appspot.com",
    messagingSenderId: "977631800678",
    appId: "1:977631800678:web:b245b2718a0409ea5b6ca7",
    // measurementId: "G-MRGJW3J35C"
};
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export const onMessager = () =>

new Promise((resolve) => {

onMessage(messaging, (payload) => {

resolve(payload);

});

});

export const Sendrequest = () => {

  console.log("Requesting User Permission……");
  
  Notification.requestPermission().then((permission) => {
  
  if (permission === "granted") {
  
  console.log("Notification User Permission Granted.");
  
  return getToken(messaging, { vapidKey: `BC7yaGCS9syfx_bGpyhenxk2tocNR8KZeZUnP6oGkcHXzt1_h5g0RoR_nFLI-RVmMuA1YBbxuiA3A8z6VBKP0CI` })
  
  .then((currentToken) => {
  
  if (currentToken) {
  
  console.log("Client Token: ", currentToken);
  
  } else {
  
  console.log("Failed to generate the registration token.");
  
  }
  
  })
  
  .catch((err) => {
  
  console.log("An error occurred when requesting to receive the token.", err);
  
  });
  
  } else {
  
  console.log("User Permission Denied.");
  
  }
  
  });
  
  } 

// export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});


