import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF3mnD-NHHfUAO4V-MmH_0RYPzO8Snb7A",
  authDomain: "workoutmapper-4436f.firebaseapp.com",
  projectId: "workoutmapper-4436f",
  storageBucket: "workoutmapper-4436f.appspot.com",
  messagingSenderId: "336799343501",
  appId: "1:336799343501:web:91a49cbbc7bc611cbe13c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
  const email = document.querySelector(".email");
  const password = document.querySelector(".password");
  const submit = document.querySelector(".submit_register");

  submit.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailValue = email.value;
    const passwordValue = password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );
      const user = userCredential.user;
      console.log("User registered:", user);
      alert("Registration successful!");
      window.location.href = 'index.html'; 
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed: " + error.message);
    }
  });
});
