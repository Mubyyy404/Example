import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      phone: phone,
      createdAt: new Date().toISOString(),
      purchasedCourses: [],
    });

    // Send verification email
    await sendEmailVerification(user)
      .then(() => {
        alert("✅ Account created successfully! A verification email has been sent to " + email + ". Please verify before logging in.");
      })
      .catch((error) => {
        console.error("Error sending verification email:", error);
        alert("❌ Failed to send verification email: " + error.message);
      });

    registerForm.reset();
  } catch (error) {
    console.error("Registration error:", error);
    alert("❌ " + error.message);
  }
});
