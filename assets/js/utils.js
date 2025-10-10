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

/* calculates age based on the DOB */
function calculateAge(dob) {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

/* shows a toast notification on the top right of the screen */
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--success);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                z-index: 2000;
                animation: slideIn 0.3s ease;
            `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}


/** shows a warning toast notification on the top right of the screen */
function showWarningNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--warning);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                z-index: 2000;
                animation: slideIn 0.3s ease;
            `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/* shows a toast notification on the top right of the screen */
function showErrorNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--danger);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                z-index: 2000;
                animation: slideIn 0.3s ease;
            `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/* Close modal when clicking outside */
window.onclick = (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};

/* Export data to a CSV file functionality */
function exportToCSV(data, filename) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* convert data to CSV */
function convertToCSV(data) {
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(",");
  const csvRows = data.map((row) =>
    headers.map((header) => `"${row[header]}"`).join(","),
  );
  return `${csvHeaders}\n${csvRows.join("\n")}`;
}

/* Print functionality */
function printReport() {
  window.print();
}

/* Initialize date inputs with today's date */
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  const dateInputs = [
    "appointmentDate",
    "appointmentDateInput",
    "reportFromDate",
    "reportToDate",
  ];
  dateInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.value = today;
    }
  });
});

/* Keyboard shortcuts */
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    const searchInput = document.querySelector(
      '.search-bar input[type="text"]',
    );
    if (searchInput) {
      searchInput.focus();
    }
  }

  // ESC to close modals
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (modal.style.display === "flex") {
        modal.style.display = "none";
      }
    });
  }
});

/* functionality to export report to PDF */
function exportReport() {
  showErrorNotification("Not yet implemented");
}

/* Keyboard shortcuts */
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    const searchInput = document.querySelector(
      '.search-bar input[type="text"]',
    );
    if (searchInput) {
      searchInput.focus();
    }
  }

  // ESC to close modals
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (modal.style.display === "flex") {
        modal.style.display = "none";
      }
    });
  }
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
  } else {
    console.error("Modal not found:", modalId);
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

/** getOccupancyRate() fetches the
 * rate of occupied beds
 */
function getOccupancyRate(rooms) {
  let totalBeds = 0;
  let occupiedBedsCount = 0;
  let availableBedsCount = 0;

  rooms.forEach((room) => {
    totalBeds += room.totalBeds;
    room.occupiedBeds.forEach((bed) => {
      if (bed.patient) {
        occupiedBedsCount++;
      } else {
        availableBedsCount++;
      }
    });
  });

  return Math.round((occupiedBedsCount / totalBeds) * 100);
}

/**
 * TODO: make it work to simulate real API calls
 * Loads JSON data from a file
 * @param {string} filePath
 * @returns {Promise<any>}
 */
function loadJSON(filePath) {
  return fetch(filePath)
    .then(response => {
      if (!response.ok) {
        console.log("not loading")
        throw new Error("Failed to load " + filePath);
      }
      return response.json();
    });
}


function formatDate(dateStr) {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const date = new Date(dateStr);
  if (isNaN(date)) return ""

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

/**
 * This function clears the search bars in the application
 * @param {string} searchBarElementId - the element of the search bar
 * @param {string} pageName - the page name so that the page will reload
*/
function clearSearchBar(searchBarElementId, pageName) {
  DOM.get(searchBarElementId).value = '';
  loadPageData(pageName);
}
