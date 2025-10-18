/* patients page */

/** Initialize Patients Page
 * */
function loadPatients() {
    // Update statistics
    DOM.setValue("totalPatientsCount", patients.length);
    DOM.setValue("newPatientsMonth", 2);
    DOM.setValue("activePatients", patients.length - 1);
    DOM.setValue("criticalPatients", 1);

    const html = patients
        .map((patient) => {
            // const lastVisit =
            //     patient.medicalHistory && patient.medicalHistory.length > 0
            //         ? patient.medicalHistory[0].date
            //         : "No visits";
            // const hasAllergies =
            //     patient.allergies && patient.allergies.length > 0;
            // const hasChronic =
            //     patient.chronicConditions &&
            //     patient.chronicConditions.length > 0;
            // const status = hasChronic ? "Chronic" : "Regular";
            // const statusClass = hasChronic ? "warning" : "success";

            return `
                    <tr>
                        <td>${patient.id}</td>
                        <td> ${patient.name}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn action-btn-primary" onclick="viewPatient('${patient.id}')" title="View Patient">
                                    <i class="ri-eye-line"></i>
                                </button>
                                <button class="action-btn action-btn-primary" onclick="editPatientInQueue('${patient.id}')" title="Edit Patient">
                                    <i class="ri-edit-2-line"></i>
                                </button>
                                <button class="action-btn action-btn-danger" onclick="deletePatientInQueue('${patient.id}')" title="Delete Patient">
                                    <i class="ri-delete-bin-6-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
        })
        .join("");

    DOM.setHTML("patientsInQueueTable", html);
    DOM.setHTML("patientsTodaysInvoiceTable", html);
}

/**
 * Update the dashboard statistics (counts).
 * @param {Patient[]} patientList
 */
function updatePatientStats(patientList) {
    const total = patientList.length;

    DOM.setValue("totalPatientsCount", total);
    DOM.setValue("newPatientsMonth", 2);
    DOM.setValue("activePatients", total - 1);
    DOM.setValue("criticalPatients", 1);
}

/**
 * Render the patients table rows.
 * @param {Patient[]} patientList
 */
function renderPatientsTable(patientList) {
    const rows = patientList.map((patient) => {
        const lastVisit = getLastPatientVisit(patient);
        const statusInfo = getPatientStatus(patient);
        const allergyIcon = patient.allergies?.length
            ? `<span title="Has allergies" class="icon-danger">!</span>`
            : "";

        return `
      <tr>
        <td>${patient.id}</td>
        <td>
          <div class="patient-name">
            ${patient.name} ${allergyIcon}
          </div>
        </td>
        <td>${patient.age}</td>
        <td>${patient.gender}</td>
        <td>${patient.phone}</td>
        <td>${patient.bloodGroup || "Unknown"}</td>
        <td>${lastVisit}</td>
        <td><span class="badge badge-${statusInfo.class}">${statusInfo.label}</span></td>
        <td>${renderPatientActions(patient.id)}</td>
      </tr>
    `;
    });

    DOM.setHTML("patientsInQueueTable", rows.join(""));
}

/**
 * Helper: get the last visit date of the patient.
 * @param {Patient} patient
 * @returns {string}
 */
function getLastPatientVisit(patient) {
    if (patient.medicalHistory?.length) {
        return patient.medicalHistory[0].date; //TODO: ensure sorted by date.
    }

    return "No Visits";
}

/**
 * Helper: Derive the patient status.
 * @param {Patient} patient
 * @returns {string}
 */
function getPatientStatus(patient) {
    if (patient.chronicConditions?.length) {
        return { label: "Chronic", class: "warning" };
    }
    return { label: "Regular", class: "success" };
}

/**
 * Render the action buttons for the patient row.
 * @param {string} patientId - the id of the patient.
 * @returns {string} - HTML string of the div with the buttons.
 */
function renderPatientActions(patientId) {
    return `
    <div class="action-buttons">
      <button class="btn btn-primary" onclick="viewPatient('${patientId}')">View</button>
      <button class="btn btn-outline" onclick="quickConsultation('${patientId}')">Consult</button>
    </div>
  `;
}

/**
 * Export Patient Data to CSV
 * TODO need to modify this
 */
function exportPatientData() {
    const data = patients.map((p) => ({
        ID: p.id,
        Name: p.name,
        Age: p.age,
        Gender: p.gender,
        Phone: p.phone,
        Email: p.email,
        BloodGroup: p.bloodGroup || "Unknown",
        Allergies: p.allergies ? p.allergies.join(", ") : "None",
        ChronicConditions: p.chronicConditions
            ? p.chronicConditions.join(", ")
            : "None",
    }));
    exportToCSV(data, "patients_data.csv");
    showNotification("Patient data exported successfully");
}

function quickConsultation(patientId) {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
        showNotification(`Starting consultation for ${patient.name}`);
        openNewConsultationModal();
    }
}

/**
 * Save patient from Add Patient Modal
 * (fixed: bloodGroup property name)
 */
function savePatient() {
    const newPatient = {
        id: "PT" + String(patients.length + 1).padStart(3, "0"),
        name:
            (document.getElementById("patientFirstName").value || "").trim() +
            " " +
            (document.getElementById("patientLastName").value || "").trim(),
        age: calculateAge(document.getElementById("patientDOB").value),
        gender: document.getElementById("patientGender").value,
        phone: document.getElementById("patientPhone").value,
        email: document.getElementById("patientEmail").value,
        address: document.getElementById("patientAddress").value,
        bloodGroup: document.getElementById("patientBloodGroup").value,
        emergencyContact: document.getElementById("patientEmergency").value,
    };

    patients.push(newPatient);
    // Ensure UI updates
    if (typeof loadPatients === "function") loadPatients();
    if (typeof loadData === "function") loadData();
    if (typeof initializeDashboard === "function") initializeDashboard();

    // Close add modal if helper exists
    if (typeof closeModal === "function") closeModal("addPatientModal");

    showNotification("Patient added successfully!");
}

/**
 * Switch patient detail tab (info/medical/medications/labs/immunizations)
 * Uses the provided tabName and finds the matching tab button by onclick attribute.
 * @param {string} tabName
 */
function switchPatientTab(tabName) {
    // hide all tab contents and remove active from all tab buttons
    document
        .querySelectorAll("#view-patient-page .tab-content")
        .forEach((el) => el.classList.remove("active"));
    document
        .querySelectorAll("#view-patient-page .tab-btn")
        .forEach((el) => el.classList.remove("active"));

    // activate the content
    const content = document.getElementById(`${tabName}-patient-tab`);
    if (content) content.classList.add("active");

    // find the tab button which has onclick="switchPatientTab('tabName')"
    const selector = `#view-patient-page .tab-btn[onclick="switchPatientTab('${tabName}')"]`;
    const btn = document.querySelector(selector);
    if (btn) {
        btn.classList.add("active");
    } else {
        // fallback: first tab button
        const firstBtn = document.querySelector("#view-patient-page .tab-btn");
        if (firstBtn) firstBtn.classList.add("active");
    }
}

/* ----------------------
   View renderers (fixed)
   ---------------------- */

/**
 * Renders the patient basic info tab
 * @param {Object} patient
 */
function viewPatientInfo(patient) {
    if (!patient) return;

    // Build initials safely and set avatar
    const initials = (patient.name || "")
        .split(" ")
        .map((n) => (n ? n[0] : ""))
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const avatarEl = document.getElementById("patientAvatar");
    if (avatarEl) avatarEl.textContent = initials || "NA";

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? "";
    };

    setText("patientNameDisplay", patient.name || "NA");
    setText("patientIdDisplay", patient.id || "");
    setText("patientBloodGroupDisplay", patient.bloodGroup || "NA");
    setText("patientAgeDisplay", patient.age ? patient.age + " years" : "—");
    setText("patientGenderDisplay", patient.gender || "NA");
    setText("patientPhoneDisplay", patient.phone || "NA");
    setText("patientEmailDisplay", patient.email || "NA");
    setText("patientAddressDisplay", patient.address || "Not provided");
    setText("patientEmergencyDisplay", patient.emergencyContact || "NA");

    // Update allergies
    const allergiesDiv = document.getElementById("patientAllergiesDisplay");
    if (allergiesDiv) {
        if (patient.allergies && patient.allergies.length > 0) {
            allergiesDiv.innerHTML = patient.allergies
                .map((a) => `<span class="badge badge-danger">${a}</span>`)
                .join(" ");
        } else {
            allergiesDiv.innerHTML =
                '<span class="text-gray-400">None reported</span>';
        }
    }

    // Update chronic conditions
    const conditionsDiv = document.getElementById("patientConditionsDisplay");
    if (conditionsDiv) {
        if (patient.chronicConditions && patient.chronicConditions.length > 0) {
            conditionsDiv.innerHTML = patient.chronicConditions
                .map((c) => `<span class="badge badge-warning">${c}</span>`)
                .join(" ");
        } else {
            conditionsDiv.innerHTML =
                '<span class="text-gray-400">None reported</span>';
        }
    }
}

/* ----------------------
   Medical/meds/labs/immun
   ---------------------- */

function viewPatientMedicalHistory(patient) {
    const medicalHistoryDiv = document.getElementById("medicalHistoryList");
    if (!medicalHistoryDiv) return;

    if (patient.medicalHistory && patient.medicalHistory.length > 0) {
        medicalHistoryDiv.innerHTML = patient.medicalHistory
            .map(
                (h) => `
            <div class="card" class="mb-3">
                <div class="flex justify-between items-start">
                    <div class="p-3">
                        <div style="flex items-center gap-2">
                            <span class="uppercase font-semibold">${h.type}</span>
                            <span class="text-gray-400 text-xs">${formatDate(h.date)}</span>
                        </div>
                        <div class="pl-2">
                            <h4>${h.diagnosis || ""}</h4>
                            <p class="text-sm">${h.notes || ""}</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
            )
            .join("");
    } else {
        medicalHistoryDiv.innerHTML =
            '<p class="font-semibold">No medical history available</p>';
    }
}

function viewPatientMedications(patient) {
    const medicationsDiv = document.getElementById("currentMedicationsList");
    if (!medicationsDiv) return;

    if (patient.currentMedications && patient.currentMedications.length > 0) {
        medicationsDiv.innerHTML = patient.currentMedications
            .map(
                (m) => `
            <div class="card" class="mb-3">
                <div class="flex justify-between items-center">
                    <div class="p-3">
                        <h4 class="font-semibold uppercase">${m.name}</h4>
                        <div class="pl-2">
                            <p>${m.dose || "NA"}</p>
                            <p>${m.frequency || "NA"}</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
            )
            .join("");
    } else {
        medicationsDiv.innerHTML =
            '<p class="text-gray-400">No current medications</p>';
    }
}

function viewPatientLabReports(patient) {
    const labReportsTable = document.getElementById("labReportsTable");
    if (!labReportsTable) return;

    if (patient.labReports && patient.labReports.length > 0) {
        labReportsTable.innerHTML = patient.labReports
            .map(
                (l) => `
            <tr>
                <td>${formatDate(l.date) || "—"}</td>
                <td>${l.test || "NA"}</td>
                <td><span class="badge badge-${(l.result || "").includes("Normal") ? "success" : "warning"}">${l.result || "—"}</span></td>
                <td><button class="btn btn-outline">View</button></td>
            </tr>
        `,
            )
            .join("");
    } else {
        labReportsTable.innerHTML =
            '<tr><td colspan="4" class="text-center font-semibold">No lab reports available</td></tr>';
    }
}

function viewPatientImmunizations(patient) {
    const immunizationsTable = document.getElementById("immunizationsTable");
    if (!immunizationsTable) return;

    if (patient.immunizations && patient.immunizations.length > 0) {
        immunizationsTable.innerHTML = patient.immunizations
            .map((i) => {
                const nextDueDate =
                    i.nextDue && i.nextDue !== "Completed"
                        ? new Date(i.nextDue)
                        : null;
                const isDue = nextDueDate ? nextDueDate < new Date() : false;
                const status =
                    i.nextDue === "Completed"
                        ? "Completed"
                        : isDue
                          ? "Overdue"
                          : "Up to date";
                const statusClass =
                    i.nextDue === "Completed"
                        ? "success"
                        : isDue
                          ? "danger"
                          : "success";

                return `
                <tr>
                    <td>${i.vaccine || "—"}</td>
                    <td>${i.date || "—"}</td>
                    <td>${i.nextDue || "—"}</td>
                    <td><span class="badge badge-${statusClass}">${status}</span></td>
                </tr>
            `;
            })
            .join("");
    } else {
        immunizationsTable.innerHTML =
            '<tr><td colspan="4" class="text-center font-semibold">No immunization records available</td></tr>';
    }
}

/* ----------------------
   Page switching helpers
   ---------------------- */

/**
 * Show the view-patient page and hide the patients list page.
 * Keeps browser history so back button returns to list.
 * @param {string} id - patient id
 */
function viewPatient(id) {
    const patient = patients.find((p) => p.id === id);
    if (!patient) return;

    // Populate patient data
    viewPatientInfo(patient);
    viewPatientMedicalHistory(patient);
    viewPatientMedications(patient);
    viewPatientLabReports(patient);
    viewPatientImmunizations(patient);

    // Reset to first tab
    switchPatientTab("info");

    const patientsPage = document.getElementById("patients-page");
    if (patientsPage) patientsPage.classList.add("hide");

    // Show view patient page using class toggle
    const viewPage = document.getElementById("view-patient-page");
    if (viewPage) viewPage.classList.add("active");
}

/**
 * Go back to patients list view from the patient detail view.
 * If called via browser back button, history.popstate handler should call this.
 */
function backToPatients() {
    const viewPage = document.getElementById("view-patient-page");
    if (viewPage) viewPage.classList.remove("active");

    const patientsPage = document.getElementById("patients-page");
    if (patientsPage) patientsPage.classList.remove("hide");

    // Normalize URL
    try {
        if (location.hash && location.hash.startsWith("#/patient/")) {
            history.pushState({}, "", location.pathname + location.search);
        }
    } catch (e) {}
}

/* Keep browser back behavior working: when user presses back, go back to patients list */
window.addEventListener("popstate", (ev) => {
    const state = ev.state;
    if (!state || state.page !== "view-patient") {
        // show patients list
        backToPatients();
    } else {
        // show the patient id if present
        if (state.id) viewPatient(state.id);
    }
});
/* Keep browser back behavior working: when user presses back, go back to patients list */
window.addEventListener("popstate", (ev) => {
    const state = ev.state;
    if (!state || state.page !== "view-patient") {
        // show patients list
        backToPatients();
    } else {
        // show the patient id if present
        if (state.id) viewPatient(state.id);
    }
});

/* search patients */
function searchPatients() {
    const searchTerm = document
        .getElementById("patientSearch")
        .value.toLowerCase();
    const filtered = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.id.toLowerCase().includes(searchTerm) ||
            p.phone.includes(searchTerm),
    );

    const table = document.getElementById("patientsInQueueTable");
    table.innerHTML = filtered
        .map((patient) => {
            const lastVisit =
                patient.medicalHistory && patient.medicalHistory.length > 0
                    ? patient.medicalHistory[0].date
                    : "No visits";
            return `
              <tr>
              <td>${patient.id}</td>
              <td>${patient.name}</td>
              <td>
              <button class="btn btn-primary" onclick="viewPatient('${patient.id}')" style="padding: 6px 12px; font-size: 12px;">View</button>
              </td>
              </tr>
              `;
        })
        .join("");
}

function printPatientList() {
    window.print();
    showNotification("Patient list sent to printer");
}

function openAddPatientModal() {
    openModal("addPatientModal");
}

function printPatientRecord() {
    window.print();
    showNotification("Patient record sent to printer");
}

/**
 * Edit patient while in view page: hide detail page and open add modal for editing
 */
function editPatient() {
    // hide detail page
    const viewPage = document.getElementById("view-patient-page");
    if (viewPage) viewPage.classList.remove("active");

    // open add modal so user can edit (existing function)
    if (typeof openModal === "function") openModal("addPatientModal");

    showNotification("Edit patient functionality would be implemented here");
}

function resetAddPatientQueueForm() {
    // Reset all input fields and textarea
    DOM.get("addPatientQueueName").value = "";
    DOM.get("addPatientQueueAge").value = "";
    DOM.get("addPatientQueueWeight").value = "";
    DOM.get("addPatientQueueSex").value = "";
    DOM.get("addPatientQueuePhone").value = "";
    DOM.get("addPatientQueueAddress").value = "";

    // Uncheck all checkboxes in 'complain' group
    const complains = document.querySelectorAll('input[name="complain"]');
    complains.forEach((checkbox) => {
        checkbox.checked = false;
    });
}
