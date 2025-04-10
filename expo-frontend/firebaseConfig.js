// This code initializes a Firebase application with a given configuration and exports the authentication service.
import { initializeApp } from "firebase/app"; 
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import the Firebase Authentication service and onAuthStateChanged method

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVqyjSyDEvXsRtQY5cm10Ma7lW4jpmPO4",
    authDomain: "sessionapp-f1bcc.firebaseapp.com",
    projectId: "sessionapp-f1bcc",
    storageBucket: "sessionapp-f1bcc.firebasestorage.app",
    messagingSenderId: "16432623033",
    appId: "1:16432623033:web:31f5c7065b9c626aa31a68"
  };

const app = initializeApp(firebaseConfig); // Initialize Firebase
const auth = getAuth(app); // Get the Firebase Authentication service

// Function to track the logged-in user's ID
const trackUserId = (callback) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, pass the user ID to the callback
            callback(user.uid);
        } else {
            // User is signed out, pass null to the callback
            callback(null);
        }
    });
};

export { auth, trackUserId };