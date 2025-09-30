/* only for dev purpose change skipLogin to false to revert back to normal */
const skipLogin = true;

let currentUser = "";
let currentRole = "";

// Login Initialization
function initializeLogin() {
  if (skipLogin) {
    currentUser = "Donald Trump"
    currentRole = "admin"
    login(currentUser, currentRole);
    return
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const role = document.getElementById("role").value;

      if (username) {
        currentUser = username;
        currentRole = role;
        login(username, role);
      }
    });
  }
}

// Login Function
function login(username, role) {
  // Hide login, show app
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";

  // Update user info
  document.getElementById("userDisplay").textContent = username;
  document.getElementById("roleDisplay").textContent =
    role.charAt(0).toUpperCase() + role.slice(1);
  document.getElementById("userAvatar").textContent = username.charAt(0).toUpperCase();

  // Load default page
  // loadPage("dashboard.html");

  // Call init data if exists
  if (typeof loadData === "function") {
    loadData();
  }
}

// Logout
function logout() {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("mainApp").style.display = "none";

  // Clear inputs if present
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  if (usernameInput) usernameInput.value = "";
  if (passwordInput) passwordInput.value = "";
}

// DOM Ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeLogin);
} else {
  initializeLogin();
}

