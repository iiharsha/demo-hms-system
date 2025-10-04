/**
 * Patients Management Module
 * Refactored for senior-level JavaScript practices
 */

// ============================================================================
// TYPE DEFINITIONS (same as before)
// ============================================================================

/**
 * @typedef {Object} PatientMedication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {string} date
 * @property {string} type
 * @property {string} doctor
 * @property {string} diagnosis
 * @property {string} notes
 */

/**
 * @typedef {Object} LabReport
 * @property {string} date
 * @property {string} test
 * @property {string} result
 * @property {string} file
 */

/**
 * @typedef {Object} Immunization
 * @property {string} vaccine
 * @property {string} date
 * @property {string} nextDue
 */

/**
 * @typedef {Object} Patient
 * @property {string} id
 * @property {string} name
 * @property {number} age
 * @property {"Male"|"Female"|"Other"} gender
 * @property {string} phone
 * @property {string} email
 * @property {"A+"|"A-"|"B+"|"B-"|"O+"|"O-"|"AB+"|"AB-"} bloodGroup
 * @property {string} address
 * @property {string} emergencyContact
 * @property {string[]} complaints
 * @property {string[]} allergies
 * @property {string[]} chronicConditions
 * @property {PatientMedication[]} currentMedications
 * @property {MedicalHistory[]} medicalHistory
 * @property {LabReport[]} labReports
 * @property {Immunization[]} immunizations
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

class PatientStore {
  constructor() {
    /** @type {Patient[]} */
    this.patients = [];
    this.isLoading = false;
    this.error = null;
  }

  /**
   * Load patients from JSON file
   * @returns {Promise<Patient[]>}
   */
  async loadPatients() {
    this.isLoading = true;

    try {
      const response = await fetch("assets/data/patients.json");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch patients`);
      }

      this.patients = await response.json();
      this.error = null;

      console.log("✅ Patients loaded successfully:", this.patients.length);
      return this.patients;
    } catch (error) {
      this.error = error.message;
      console.error("❌ Error loading patients:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get all patients (returns copy to prevent external mutations)
   * @returns {Patient[]}
   */
  getAll() {
    return [...this.patients];
  }

  /**
   * Get patient by ID
   * @param {string} id
   * @returns {Patient|undefined}
   */
  getById(id) {
    return this.patients.find(p => p.id === id);
  }

  /**
   * Add new patient
   * @param {Patient} patient
   */
  add(patient) {
    this.patients.push(patient);
  }

  /**
   * Search patients by term
   * @param {string} searchTerm
   * @returns {Patient[]}
   */
  search(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      return this.getAll();
    }

    return this.patients.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.phone.includes(term) ||
      (p.email && p.email.toLowerCase().includes(term))
    );
  }

  /**
   * Get statistics
   * @returns {Object}
   */
  getStats() {
    const total = this.patients.length;
    const chronic = this.patients.filter(p => p.chronicConditions?.length).length;

    return {
      total,
      newThisMonth: 2, // TODO: Calculate from actual data
      active: total - 1, // TODO: Calculate from actual data
      critical: 1, // TODO: Calculate from actual data
      chronic
    };
  }

  /**
   * Generate next patient ID
   * @returns {string}
   */
  generateNextId() {
    const nextNum = this.patients.length + 1;
    return `PA${String(nextNum).padStart(3, "0")}`;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const PatientUtils = {
  /**
   * Get most recent visit date
   * @param {Patient} patient
   * @returns {string}
   */
  getLastVisit(patient) {
    if (!patient.medicalHistory?.length) {
      return "No visits";
    }

    const sorted = [...patient.medicalHistory].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    return sorted[0].date;
  },

  /**
   * Get patient status
   * @param {Patient} patient
   * @returns {{label: string, class: string}}
   */
  getStatus(patient) {
    if (patient.chronicConditions?.length) {
      return { label: "Chronic", class: "warning" };
    }
    return { label: "Regular", class: "success" };
  },

  /**
   * Check if patient has allergies
   * @param {Patient} patient
   * @returns {boolean}
   */
  hasAllergies(patient) {
    return Boolean(patient.allergies?.length);
  },

  /**
   * Calculate age from DOB
   * @param {string} dob
   * @returns {number}
   */
  calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  },

  /**
   * Get initials from name
   * @param {string} name
   * @returns {string}
   */
  getInitials(name) {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  }
};


// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

const PatientRenderer = {
  /**
   * Render patients table
   * @param {Patient[]} patients
   */
  renderTable(patients) {
    const table = DOM.get("patientsTable");
    if (!table) return;

    if (!patients.length) {
      table.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; color: #6b7280; padding: 40px;">
            No patients found
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = patients.map(p => this.renderTableRow(p)).join("");
  },

  /**
   * Render single table row
   * @param {Patient} patient
   * @returns {string}
   */
  renderTableRow(patient) {
    const lastVisit = PatientUtils.getLastVisit(patient);
    const status = PatientUtils.getStatus(patient);
    const allergyIcon = PatientUtils.hasAllergies(patient)
      ? '<span title="Has allergies" style="color: var(--danger); font-weight: bold; margin-left: 8px;">!</span>'
      : "";
    const complaints = patient.complaints?.length
      ? patient.complaints.join(", ")
      : "None";

    return `
      <tr>
        <td>${patient.id}</td>
        <td>
          <div style="display: flex; align-items: center;">
            ${patient.name}${allergyIcon}
          </div>
        </td>
        <td>${patient.age}</td>
        <td>${patient.gender}</td>
        <td>${patient.phone}</td>
        <td>${patient.bloodGroup || "Unknown"}</td>
        <td>${complaints}</td>
        <td>${lastVisit}</td>
        <td><span class="badge badge-${status.class}">${status.label}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-primary" onclick="viewPatient('${patient.id}')" 
                    style="padding: 6px 12px; font-size: 12px;">
              View
            </button>
            <button class="btn btn-outline" onclick="quickConsultation('${patient.id}')" 
                    style="padding: 6px 12px; font-size: 12px;">
              Consult
            </button>
          </div>
        </td>
      </tr>
    `;
  },

  /**
   * Render statistics
   * @param {Object} stats
   */
  renderStats(stats) {
    DOM.setText("totalPatientsCount", stats.total);
    DOM.setText("newPatientsMonth", stats.newThisMonth);
    DOM.setText("activePatients", stats.active);
    DOM.setText("criticalPatients", stats.critical);
  },

  /**
   * Render patient basic info
   * @param {Patient} patient
   */
  renderPatientInfo(patient) {
    DOM.setText("patientAvatar", PatientUtils.getInitials(patient.name));
    DOM.setText("patientNameDisplay", patient.name);
    DOM.setText("patientIdDisplay", patient.id);
    DOM.setText("patientBloodGroupDisplay", patient.bloodGroup || "Unknown");
    DOM.setText("patientAgeDisplay", `${patient.age} years`);
    DOM.setText("patientGenderDisplay", patient.gender);
    DOM.setText("patientPhoneDisplay", patient.phone);
    DOM.setText("patientEmailDisplay", patient.email);
    DOM.setText("patientAddressDisplay", patient.address || "Not provided");
    DOM.setText("patientEmergencyDisplay", patient.emergencyContact || "Not provided");

    this.renderBadges("patientAllergiesDisplay", patient.allergies, "danger");
    this.renderBadges("patientConditionsDisplay", patient.chronicConditions, "warning");
    this.renderBadges("patientComplaintsDisplay", patient.complaints, "info");
  },

  /**
   * Render badge list
   * @param {string} id
   * @param {string[]} items
   * @param {string} badgeClass
   */
  renderBadges(id, items, badgeClass) {
    if (!items?.length) {
      DOM.setHTML(id, '<span style="color: #6b7280;">None reported</span>');
      return;
    }

    const badges = items
      .map(item => `<span class="badge badge-${badgeClass}">${item}</span>`)
      .join(" ");

    DOM.setHTML(id, badges);
  },

  /**
   * Render medical history
   * @param {Patient} patient
   */
  renderMedicalHistory(patient) {
    if (!patient.medicalHistory?.length) {
      DOM.setHTML("medicalHistoryList", '<p style="color: #6b7280;">No medical history available</p>');
      return;
    }

    const sorted = [...patient.medicalHistory].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    const html = sorted.map(record => `
      <div class="card" style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <span class="badge badge-primary">${record.type}</span>
              <span style="color: #6b7280; font-size: 14px;">${record.date}</span>
              <span style="color: #6b7280; font-size: 14px;">• ${record.doctor}</span>
            </div>
            <h4 style="margin-bottom: 8px;">${record.diagnosis}</h4>
            <p style="color: #6b7280; font-size: 14px;">${record.notes}</p>
          </div>
        </div>
      </div>
    `).join("");

    DOM.setHTML("medicalHistoryList", html);
  },

  /**
   * Render medications
   * @param {Patient} patient
   */
  renderMedications(patient) {
    if (!patient.currentMedications?.length) {
      DOM.setHTML("currentMedicationsList", '<p style="color: #6b7280;">No current medications</p>');
      return;
    }

    const html = patient.currentMedications.map(med => `
      <div class="card" style="margin-bottom: 15px; background: var(--light);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="color: var(--primary); margin-bottom: 5px;">${med.name}</h4>
            <p style="margin: 0;"><strong>Dosage:</strong> ${med.dose}</p>
            <p style="margin: 0;"><strong>Frequency:</strong> ${med.frequency}</p>
          </div>
          <div style="font-size: 24px;">💊</div>
        </div>
      </div>
    `).join("");

    DOM.setHTML("currentMedicationsList", html);
  },

  /**
   * Render lab reports
   * @param {Patient} patient
   */
  renderLabReports(patient) {
    if (!patient.labReports?.length) {
      DOM.setHTML("labReportsTable", `
        <tr>
          <td colspan="4" style="text-align: center; color: #6b7280;">
            No lab reports available
          </td>
        </tr>
      `);
      return;
    }

    const html = patient.labReports.map(report => `
      <tr>
        <td>${report.date}</td>
        <td>${report.test}</td>
        <td>
          <span class="badge badge-${report.result.includes("Normal") ? "success" : "warning"}">
            ${report.result}
          </span>
        </td>
        <td>
          <button class="btn btn-outline" style="padding: 4px 12px; font-size: 12px;">
            📄 View
          </button>
        </td>
      </tr>
    `).join("");

    DOM.setHTML("labReportsTable", html);
  },

  /**
   * Render immunizations
   * @param {Patient} patient
   */
  renderImmunizations(patient) {
    if (!patient.immunizations?.length) {
      DOM.setHTML("immunizationsTable", `
        <tr>
          <td colspan="4" style="text-align: center; color: #6b7280;">
            No immunization records available
          </td>
        </tr>
      `);
      return;
    }

    const html = patient.immunizations.map(imm => {
      const isDue = imm.nextDue !== "Completed" && new Date(imm.nextDue) < new Date();
      const status = imm.nextDue === "Completed" ? "Completed" : isDue ? "Overdue" : "Up to date";
      const statusClass = imm.nextDue === "Completed" ? "success" : isDue ? "danger" : "success";

      return `
        <tr>
          <td>${imm.vaccine}</td>
          <td>${imm.date}</td>
          <td>${imm.nextDue}</td>
          <td><span class="badge badge-${statusClass}">${status}</span></td>
        </tr>
      `;
    }).join("");

    DOM.setHTML("immunizationsTable", html);
  }
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

// Create global store instance
const patientStore = new PatientStore();

/**
 * Initialize and load patients
 */
async function loadPatients() {
  try {
    await patientStore.loadPatients();
    const patients = patientStore.getAll();
    const stats = patientStore.getStats();

    PatientRenderer.renderTable(patients);
    PatientRenderer.renderStats(stats);
  } catch (error) {
    console.error("Failed to load patients:", error);
    if (typeof showNotification === "function") {
      showNotification("Failed to load patient data. Please refresh the page.");
    }
  }
}

/**
 * View patient details
 * @param {string} patientId
 */
function viewPatient(patientId) {
  const patient = patientStore.getById(patientId);

  if (!patient) {
    console.error("Patient not found:", patientId);
    return;
  }

  // Render all tabs
  PatientRenderer.renderPatientInfo(patient);
  PatientRenderer.renderMedicalHistory(patient);
  PatientRenderer.renderMedications(patient);
  PatientRenderer.renderLabReports(patient);
  PatientRenderer.renderImmunizations(patient);

  // Switch to first tab and open modal
  switchPatientTab("info");

  if (typeof openModal === "function") {
    openModal("viewPatientModal");
  }
}

/**
 * Quick consultation
 * @param {string} patientId
 */
function quickConsultation(patientId) {
  const patient = patientStore.getById(patientId);

  if (!patient) {
    console.error("Patient not found:", patientId);
    return;
  }

  if (typeof showNotification === "function") {
    showNotification(`Starting consultation for ${patient.name}`);
  }

  if (typeof openNewConsultationModal === "function") {
    openNewConsultationModal();
  }
}

/**
 * Search patients
 */
function searchPatients() {
  const searchTerm = DOM.getValue("patientSearch");
  const results = patientStore.search(searchTerm);
  PatientRenderer.renderTable(results);
}

/**
 * Save new patient
 */
function savePatient() {
  try {
    const newPatient = {
      id: patientStore.generateNextId(),
      name: `${DOM.getValue("patientFirstName")} ${DOM.getValue("patientLastName")}`.trim(),
      age: PatientUtils.calculateAge(DOM.getValue("patientDOB")),
      gender: DOM.getValue("patientGender"),
      phone: DOM.getValue("patientPhone"),
      email: DOM.getValue("patientEmail"),
      address: DOM.getValue("patientAddress"),
      bloodGroup: DOM.getValue("patientBloodGroup"),
      emergencyContact: DOM.getValue("patientEmergency"),
      complaints: [],
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      medicalHistory: [],
      labReports: [],
      immunizations: []
    };

    patientStore.add(newPatient);

    // Re-render
    const patients = patientStore.getAll();
    const stats = patientStore.getStats();
    PatientRenderer.renderTable(patients);
    PatientRenderer.renderStats(stats);

    if (typeof closeModal === "function") {
      closeModal("addPatientModal");
    }

    if (typeof showNotification === "function") {
      showNotification("Patient added successfully!");
    }
  } catch (error) {
    console.error("Failed to save patient:", error);
    if (typeof showNotification === "function") {
      showNotification("Failed to add patient");
    }
  }
}

/**
 * Switch patient detail tab
 * @param {string} tabName
 */
function switchPatientTab(tabName) {
  // Update tab buttons
  document.querySelectorAll("#viewPatientModal .tab-btn").forEach(btn => {
    btn.classList.remove("active");
    const btnText = btn.textContent.toLowerCase();

    if (btnText.includes(tabName) ||
      (tabName === "info" && btnText.includes("basic info")) ||
      (tabName === "medical" && btnText.includes("medical history")) ||
      (tabName === "labs" && btnText.includes("lab reports"))) {
      btn.classList.add("active");
    }
  });

  // Update tab content
  document.querySelectorAll("#viewPatientModal .tab-content").forEach(content => {
    content.classList.remove("active");
  });

  const tabElement = DOM.get(`${tabName}-patient-tab`);
  if (tabElement) {
    tabElement.classList.add("active");
  }
}

/**
 * Export patient data to CSV
 */
function exportPatientData() {
  try {
    const patients = patientStore.getAll();
    const data = patients.map(p => ({
      ID: p.id,
      Name: p.name,
      Age: p.age,
      Gender: p.gender,
      Phone: p.phone,
      Email: p.email,
      BloodGroup: p.bloodGroup || "Unknown",
      Allergies: p.allergies?.join(", ") || "None",
      ChronicConditions: p.chronicConditions?.join(", ") || "None"
    }));

    if (typeof exportToCSV === "function") {
      exportToCSV(data, "patients_data.csv");
      if (typeof showNotification === "function") {
        showNotification("Patient data exported successfully");
      }
    } else {
      console.error("exportToCSV function not found");
    }
  } catch (error) {
    console.error("Failed to export data:", error);
  }
}

/**
 * Print patient list
 */
function printPatientList() {
  window.print();
  if (typeof showNotification === "function") {
    showNotification("Patient list sent to printer");
  }
}

/**
 * Print patient record
 */
function printPatientRecord() {
  window.print();
  if (typeof showNotification === "function") {
    showNotification("Patient record sent to printer");
  }
}

/**
 * Open add patient modal
 */
function openAddPatientModal() {
  if (typeof openModal === "function") {
    openModal("addPatientModal");
  }
}

/**
 * Edit patient
 */
function editPatient() {
  if (typeof closeModal === "function") {
    closeModal("viewPatientModal");
  }
  if (typeof openModal === "function") {
    openModal("addPatientModal");
  }
  if (typeof showNotification === "function") {
    showNotification("Edit patient functionality would be implemented here");
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Auto-initialize when DOM is ready (for page loading via navigation)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadPatients);
} else {
  // If script loads after DOM is ready (e.g., dynamic page loading)
  // Check if we're on the patients page before loading
  if (DOM.get("patientsTable")) {
    loadPatients();
  }
}
