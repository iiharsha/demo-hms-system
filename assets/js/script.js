/* ===============================================
   SPA Main Script - Handles page routing, sidebar,
   submenu, collapse toggle, and session management
   =============================================== */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".page-content");

  /* -------------------------
     Navigation Handlers
  ------------------------- */
  function attachNavHandlers() {
    document.querySelectorAll(".nav-item[data-page], .nav-submenu-item[data-page]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const page = btn.dataset.page;
        showPage(page);
      });
    });
  }
  attachNavHandlers();

  /* -------------------------
     Load Initial Page
  ------------------------- */
  const initial = document.querySelector(".nav-menu .nav-item.active");
  const startPage = initial ? initial.dataset.page : "dashboard.html";
  showPage(startPage);

  /* -------------------------
     Sidebar & Pharmacy Submenu
  ------------------------- */
  const sidebar = document.querySelector('.sidebar');
  const pharmacyToggle = document.getElementById("pharmacyToggle");
  const pharmacySubmenu = document.getElementById("pharmacySubmenu");

  // Pharmacy submenu toggle
  if (pharmacyToggle && pharmacySubmenu) {
    pharmacyToggle.addEventListener("click", (e) => {
      e.preventDefault();
      if (sidebar?.classList.contains('collapsed')) return; // don't toggle if collapsed
      pharmacyToggle.classList.toggle("expanded");
      pharmacySubmenu.classList.toggle("expanded");
    });
  }

  // Sidebar collapse toggle
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');

      // Close submenu when collapsed
      if (sidebar.classList.contains('collapsed')) {
        pharmacySubmenu?.classList.remove('expanded');
        pharmacyToggle?.classList.remove('expanded');
      }

      // Save state
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
  }

  // Restore sidebar state
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState === 'true' && sidebar) sidebar.classList.add('collapsed');

  /* -------------------------
     SPA Page Loading
  ------------------------- */
  async function showPage(pageParam) {
    if (!container) return console.error("page container not found.");

    const pageName = pageParam.replace(/\.html$/i, "");
    const fetchHtml = `pages/${pageName}.html`;

    try {
      const res = await fetch(fetchHtml);
      if (!res.ok) throw new Error(`Failed to load ${fetchHtml}: ${res.status}`);
      container.innerHTML = await res.text();
    } catch (err) {
      container.innerHTML = showErrorPage();
      console.error("Page load error:", err);
    }

    // Activate nav item or submenu item
    activateNavItem(pageName);

    // Update header title
    const titleEl = document.querySelector(".header-title");
    if (titleEl) titleEl.textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);

    // Initialize page-specific JS function if exists
    const initFnName = "initialize" + pageName.charAt(0).toUpperCase() + pageName.slice(1);
    const initFn = window[initFnName];
    if (typeof initFn === "function") requestAnimationFrame(() => initFn());

    // Load page-specific data
    if (typeof window.loadPageData === "function") {
      try { window.loadPageData(pageName); } catch (e) { console.error(e); }
    }
  }

  function activateNavItem(pageName) {
    document.querySelectorAll(".nav-item, .nav-submenu-item").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(`[data-page="${pageName}.html"], [data-page="${pageName}"]`).forEach(el => el.classList.add("active"));
  }

  // Expose globally
  window.showPage = showPage;

  /* -------------------------
     Session Timeout
  ------------------------- */
  let sessionTimeout;
  function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
      if (confirm("Your session is about to expire. Do you want to continue?")) {
        resetSessionTimeout();
      } else {
        logout();
      }
    }, 15 * 60 * 1000);
  }
  document.addEventListener("mousemove", resetSessionTimeout);
  document.addEventListener("keypress", resetSessionTimeout);
});

/* -------------------------
   Global Functions
------------------------- */
function loadPageData(pageName) {
  switch (pageName) {
    case "patients": loadPatients(); break;
    case "appointments": loadAppointments(); break;
    case "consultations": loadConsultations(); break;
    case "admissions": loadAdmissions(); break;
    case "rooms": loadRooms(); break;
    case "billing": loadBills(); break;
    case "inventory": loadInventory(); break;
    case "pharmacy": loadPharmacy(); break;
    case "reports": loadReports(); break;
  }
}

function switchTab(tabName, btn) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll("input[required], select[required], textarea[required]");
  let isValid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = "var(--danger)";
      isValid = false;
    } else {
      input.style.borderColor = "var(--border)";
    }
  });
  return isValid;
}

