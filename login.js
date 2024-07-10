import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.querySelector('.email');
  const passwordInput = document.querySelector('.password');
  const signInBtn = document.querySelector('.sign-in-btn');
  const registerBtn = document.querySelector('.register-btn');

  signInBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed in:', user);
      alert('Login successful! Redirecting to main page...');
      window.location.href = 'main.html'; // Redirect to main page
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Login failed: ' + error.message);
    }
  });

  registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'register.html'; // Redirect to register page
  });
});
