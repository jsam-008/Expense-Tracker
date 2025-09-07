const API_BASE_URL = "http://localhost:8080/api";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

function saveToken(token) {
  localStorage.setItem("jwtToken", token);
}

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function redirectToDashboard() {
  window.location.href = "dashboard.html"; 
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        saveToken(data.token);

        // 🟢 Store user details if backend sends them
        if (data.user) {
          saveUser(data.user);
        } else {
          // fallback: store at least the email
          saveUser({ email });
        }

        redirectToDashboard();
      } else {
        const errorMsg = await response.text();
        alert("Login failed: " + errorMsg);
      }
    } catch (err) {
      alert("Error connecting to server");
      console.error(err);
    }
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        saveToken(data.token);

        // 🟢 Save user details
        saveUser({ name, email });

        redirectToDashboard();
      } else {
        const errorMsg = await response.text();
        alert("Signup failed: " + errorMsg);
      }
    } catch (err) {
      alert("Error connecting to server");
      console.error(err);
    }
  });
}

function showSignup() {
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("signupForm").classList.add("active");
  document.getElementById("formTitle").innerText = "Sign Up";
}

function showLogin() {
  document.getElementById("signupForm").classList.remove("active");
  document.getElementById("loginForm").classList.add("active");
  document.getElementById("formTitle").innerText = "Login";
}
