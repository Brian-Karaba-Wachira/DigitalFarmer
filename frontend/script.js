document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const roleSelect = document.getElementById("role");
  const authScreen = document.getElementById("auth-screen");
  const dashboards = document.querySelectorAll(".dashboard");
  const logoutBtns = document.querySelectorAll(".logout-btn");

  const API = "http://localhost:5000/api";

  async function register() {
    const user = {
      email: emailInput.value,
      password: passwordInput.value,
      role: roleSelect.value,
    };

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    alert(data.message || "Registered successfully!");
  }

  async function login() {
    const user = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      showDashboard(data.user.role);
    } else {
      alert("Invalid credentials, please try again.");
    }
  }

  function showDashboard(role) {
    authScreen.style.display = "none";
    dashboards.forEach(d => d.classList.remove("active"));

    const dash = document.getElementById(`${role}-dashboard`);
    if (dash) dash.classList.add("active");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    dashboards.forEach(d => d.classList.remove("active"));
    authScreen.style.display = "block";
  }

  loginBtn.addEventListener("click", login);
  registerBtn.addEventListener("click", register);
  logoutBtns.forEach(btn => btn.addEventListener("click", logout));

  // Auto-redirect if user is already logged in
  const savedRole = localStorage.getItem("role");
  if (savedRole) showDashboard(savedRole);
});
