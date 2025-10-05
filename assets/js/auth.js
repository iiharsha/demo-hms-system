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

  const loginForm = DOM.get("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = DOM.get("username").value;
      const role = DOM.get("role").value;

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
  DOM.get("loginScreen").style.display = "none";
  DOM.get("mainApp").style.display = "block";

  // Update user info
  DOM.get("userDisplay").textContent = username;
  DOM.get("roleDisplay").textContent =
    role.charAt(0).toUpperCase() + role.slice(1);
  DOM.get("userAvatar").textContent = username.charAt(0).toUpperCase();

  // Load default page
  // loadPage("dashboard.html");

  // Call init data if exists
  if (typeof loadData === "function") {
    loadData();
  }
}

// Logout
function logout() {
  DOM.get("loginScreen").style.display = "flex";
  DOM.get("mainApp").style.display = "none";

  // Clear inputs if present
  const usernameInput = DOM.get("username");
  const passwordInput = DOM.get("password");
  if (usernameInput) usernameInput.value = "";
  if (passwordInput) passwordInput.value = "";
}

// DOM Ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeLogin);
} else {
  initializeLogin();
}

