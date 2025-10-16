import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const resetBtn = document.getElementById("resetBtn");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("⚠️ Please verify your email before logging in.");
      await signOut(auth);
      return;
    }

    // Redirect verified users
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("❌ " + error.message);
  }
});

// 🔁 Password Reset
resetBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Please enter your email to reset password.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("📩 Password reset email sent! Check your inbox or spam folder.");
  } catch (error) {
    console.error("Reset error:", error);
    alert("❌ " + error.message);
  }
});
