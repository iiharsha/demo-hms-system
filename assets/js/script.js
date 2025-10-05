/* main script i guess */

/* navigation and rendering of pages */
document.addEventListener("DOMContentLoaded", () => {
  // attach listeners to nav items that have data-page
  document.querySelectorAll(".nav-menu .nav-item[data-page]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const page = btn.dataset.page; // might be "dashboard" or "dashboard.html"
      showPage(page);
    });
  });

  // load initial page (use the nav-item that already has .active, or fallback)
  const initial = document.querySelector(".nav-menu .nav-item.active");
  const startPage = initial ? initial.dataset.page : "dashboard.html";
  showPage(startPage);
});

async function showPage(pageParam) {
  const container = document.querySelector(".page-content");
  if (!container) {
    console.error("page container not found.");
    return;
  }

  // Normalize page name (strip .html if present)
  const pageName = pageParam.replace(/\.html$/i, ""); // e.g. "dashboard"

  // Build fetch URL (ensure you request the .html file)
  const fetchHtml = `pages/${pageName}.html`;

  try {
    const res = await fetch(fetchHtml);
    if (!res.ok) throw new Error(`Failed to load ${fetchHtml}: ${res.status}`);
    const html = await res.text();
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = showErrorPage();
    console.error("Page load error:", err);
  }

  // Update nav active classes (works whether data-page is "dashboard" or "dashboard.html")
  document.querySelectorAll(".nav-menu .nav-item[data-page]").forEach((item) => {
    const itemPageName = (item.dataset.page || "").replace(/\.html$/i, "");
    item.classList.toggle("active", itemPageName === pageName);
  });

  // Update header title (your markup has <h1 class="header-title">)
  const titleEl = document.querySelector(".header-title") || document.getElementById("pageTitle");
  if (titleEl) {
    titleEl.textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  }

  // Optionally call initialize<Page>() if you defined it, e.g. initializeDashboard()
  const initFnName = "initialize" + pageName.charAt(0).toUpperCase() + pageName.slice(1);
  const initFn = window[initFnName];
  if (typeof initFn === "function") {
    requestAnimationFrame(() => initFn())
  }

  // Optionally call loadPageData(pageName) if you use it
  if (typeof window.loadPageData === "function") {
    try { window.loadPageData(pageName); } catch (e) { console.error("loadPageData error:", e); }
  }
}

function loadPageData(pageName) {
  switch (pageName) {
    case "patients":
      loadPatients();
      break;
    case "appointments":
      loadAppointments();
      break;
    case "consultations":
      loadConsultations();
      break;
    case "admissions":
      loadAdmissions();
      break;
    case "rooms":
      loadRooms();
      break;
    case "billing":
      loadBills();
      break;
    case "inventory":
      loadInventory();
      break;
    case "reports":
      loadReports();
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

/**
 * switches tabs in a html container
 * @param {string} tabName - the tab name to switch to.
 * @param {string} btn - the reference from where switchTab is being called.
 */
function switchTab(tabName, btn) {
  // Remove "active" from all tab buttons
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));

  // Remove "active" from all tab contents
  document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));

  // Add "active" to clicked button and related tab
  btn.classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");
}


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

/* DOM Helpers */
const DOM = {
  /**
   * get element by ID with error handling 
   * @param {string} id
   * @returns {HTMLElement|null}
   */
  get(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`element with id "${id}" not found`)
    }
    return element;
  },

  /**
   * get input value
   * @param {string} id
   * @returns {string}
  */
  getValue(id) {
    const element = this.get(id);
    return element ? element.value : "";
  },

  /**
   * set the text value
   * @param {string} id
   * @param {string|number} text
   * @returns {string|number} text
  */
  setValue(id, text) {
    const element = this.get(id);
    if (element) {
      element.textContent = text;
    }
  },

  /**
   * set the text value
   * @param {string} id - element id
   * @param {string} html - html string
  */
  setHTML(id, html) {
    const element = this.get(id);
    if (element) {
      element.innerHTML = html;
    }
  },
}
