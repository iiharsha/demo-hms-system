/* main script i guess */

// Navigation
document.querySelectorAll(".nav-item[data-page]").forEach((item) => {
  item.addEventListener("click", function() {
    const page = this.getAttribute("data-page");
    console.log(`page is ${page}`)
    showPage(page);
    // loadPageData(page);
  });
});

async function loadPage(page) {
  const container = document.querySelector(".page-content");
  if (!container) {
    console.error("page container not found.");
    return;
  }

  try {
    const response = await fetch(`pages/${page}`); // no leading "./" needed
    if (!response.ok) throw new Error(`Failed to load ${page}: ${response.status}`);

    const html = await response.text();
    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = "<p>Error Loading Page.</p>";
    console.error("Page load error:", err);
  }
}

async function showPage(page) {
  const container = document.querySelector(".page-content");
  if (!container) {
    console.error("page container not found.");
    return;
  }

  try {
    const response = await fetch(`pages/${page}`); // no leading "./" needed
    if (!response.ok) throw new Error(`Failed to load ${page}: ${response.status}`);

    const html = await response.text();
    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = "<p>Error Loading Page.</p>";
    console.error("Page load error:", err);
  }

  page = page.replace(/\.html$/, "") // remove .html from
  // Update active nav
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  document
    .querySelector(`.nav-item[data-page="${page}"]`)
    .classList.add("active");

  // Hide all pages
  document.querySelectorAll(".page-content").forEach((page) => {
    page.classList.add("hide");
  });

  // Show selected page
  document.getElementById(`${page}-page`).classList.remove("hide");

  // Update header
  document.getElementById("pageTitle").textContent =
    pageName.charAt(0).toUpperCase() + page.slice(1);

  // Load page data
  loadPageData(page);
}

function loadPageData(pageName) {
  switch (pageName) {
    case "patients.html":
      loadPatients();
      break;
    case "appointments.html":
      loadAppointments();
      break;
    case "consultations.html":
      loadConsultations();
      break;
    case "admissions.html":
      loadAdmissions();
      break;
    case "rooms-bed.html":
      loadRooms();
      break;
    case "billing.html":
      loadBills();
      break;
    case "inventory.html":
      loadInventory();
      break;
  }
}

function loadData() {
  // Load patient options in dropdowns
  const patientSelects = ["appointmentPatient", "admissionPatient"];
  patientSelects.forEach((selectId) => {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML =
        "<option>Select Patient</option>" +
        patients
          .map((p) => `<option value="${p.id}">${p.name}</option>`)
          .join("");
    }
  });
}

// Time slot selection
document.querySelectorAll(".appointment-slot:not(.booked)").forEach((slot) => {
  slot.addEventListener("click", function() {
    document
      .querySelectorAll(".appointment-slot")
      .forEach((s) => s.classList.remove("selected"));
    this.classList.add("selected");
  });
});

// Tab switching
function switchTab(tabName) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  event.target.classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");
}

/*Auto - refresh dashboard stats every 30 seconds */
setInterval(() => {
  if (!document.getElementById("dashboard-page").classList.contains("hide")) {
    initializeDashboard();
  }
}, 30000);

/* Responsive sidebar toggle for mobile */
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");

  if (sidebar.style.width === "70px") {
    sidebar.style.width = "250px";
    content.style.marginLeft = "250px";
  } else {
    sidebar.style.width = "70px";
    content.style.marginLeft = "70px";
  }
}

/* Add hamburger menu for mobile (would need to add button in HTML) */
if (window.innerWidth <= 768) {
  document.querySelector(".sidebar").style.width = "70px";
  document.querySelector(".content").style.marginLeft = "70px";
}

/* Form validation */
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "var(--danger)";
      isValid = false;
    } else {
      input.style.borderColor = "var(--border)";
    }
  });

  return isValid;
}

/* Session timeout warning (would implement in production) */
let sessionTimeout;
function resetSessionTimeout() {
  clearTimeout(sessionTimeout);
  sessionTimeout = setTimeout(() => {
    if (confirm("Your session is about to expire. Do you want to continue?")) {
      resetSessionTimeout();
    } else {
      logout();
    }
  }, 15 * 60 * 1000); // 15 minutes
}

/* Start session timeout when logged in */
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);
