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
            const lastVisit =
                patient.medicalHistory && patient.medicalHistory.length > 0
                    ? patient.medicalHistory[0].date
                    : "No visits";
            const hasAllergies =
                patient.allergies && patient.allergies.length > 0;
            const hasChronic =
                patient.chronicConditions &&
                patient.chronicConditions.length > 0;
            const status = hasChronic ? "Chronic" : "Regular";
            const statusClass = hasChronic ? "warning" : "success";

            return `
                    <tr>
                        <td>${patient.id}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                ${patient.name}
                            </div>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn action-btn-primary" onclick="viewPatient('${patient.id}')" title="View Patient in Queue">
                                    <i class="ri-eye-line"></i>
                                </button>
                                <button class="action-btn action-btn-primary" onclick="editPatientInQueue('${patient.id}')" title="Edit Patient in Queue">
                                    <i class="ri-edit-2-line"></i>
                                </button>
                                <button class="action-btn action-btn-danger" onclick="deletePatientInQueue('${patient.id}')" title="Delete Patient in Queue">
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

function savePatient() {
    const newPatient = {
        id: "PA" + String(patients.length + 1).padStart(3, "0"),
        name:
            document.getElementById("patientFirstName").value +
            " " +
            document.getElementById("patientLastName").value,
        age: calculateAge(document.getElementById("patientDOB").value),
        gender: document.getElementById("patientGender").value,
        phone: document.getElementById("patientPhone").value,
        email: document.getElementById("patientEmail").value,
        address: document.getElementById("patientAddress").value,
        bloogGroup: document.getElementById("patientBloodGroup").value,
    };

    patients.push(newPatient);
    loadPatients();
    closeModal("addPatientModal");
    showNotification("Patient added successfully!");
    loadData();
    initializeDashboard();
}

/* Switch Patient Tab to a Particular tabname */
function switchPatientTab(tabName) {
    // Update tab buttons
    document.querySelectorAll("#viewPatientModal .tab-btn").forEach((btn) => {
        btn.classList.remove("active");
        if (
            btn.textContent.toLowerCase().includes(tabName) ||
            (tabName === "info" && btn.textContent === "Basic Info") ||
            (tabName === "medical" && btn.textContent === "Medical History") ||
            (tabName === "labs" && btn.textContent === "Lab Reports")
        ) {
            btn.classList.add("active");
        }
    });

    // Update tab content
    document
        .querySelectorAll("#viewPatientModal .tab-content")
        .forEach((content) => {
            content.classList.remove("active");
        });

    const tabElement = document.getElementById(`${tabName}-patient-tab`);
    if (tabElement) {
        tabElement.classList.add("active");
    }
}

/**
 * Renders the patient basic info tab
 * @param {} patient - The
 */

function viewPatientInfo(patient) {
    document.getElementById("patientAvatar").textContent = patient.name
        .split(" ")
        .map((n) => n[0])
        .join("");
    document.getElementById("patientNameDisplay").textContent = patient.name;
    document.getElementById("patientIdDisplay").textContent = patient.id;
    document.getElementById("patientBloodGroupDisplay").textContent =
        patient.bloodGroup || "Unknown";
    document.getElementById("patientAgeDisplay").textContent =
        patient.age + " years";
    document.getElementById("patientGenderDisplay").textContent =
        patient.gender;
    document.getElementById("patientPhoneDisplay").textContent = patient.phone;
    document.getElementById("patientEmailDisplay").textContent = patient.email;
    document.getElementById("patientAddressDisplay").textContent =
        patient.address || "Not provided";
    document.getElementById("patientEmergencyDisplay").textContent =
        patient.emergencyContact || "Not provided";

    // Update allergies
    const allergiesDiv = document.getElementById("patientAllergiesDisplay");
    if (patient.allergies && patient.allergies.length > 0) {
        allergiesDiv.innerHTML = patient.allergies
            .map((a) => `<span class="badge badge-danger">${a}</span>`)
            .join(" ");
    } else {
        allergiesDiv.innerHTML =
            '<span style="color: #6b7280;">None reported</span>';
    }

    // Update chronic conditions
    const conditionsDiv = document.getElementById("patientConditionsDisplay");
    if (patient.chronicConditions && patient.chronicConditions.length > 0) {
        conditionsDiv.innerHTML = patient.chronicConditions
            .map((c) => `<span class="badge badge-warning">${c}</span>`)
            .join(" ");
    } else {
        conditionsDiv.innerHTML =
            '<span style="color: #6b7280;">None reported</span>';
    }
}

/* Switch Patient Medical History Tab */
function viewPatientMedicalHistory(patient) {
    const medicalHistoryDiv = document.getElementById("medicalHistoryList");
    if (patient.medicalHistory && patient.medicalHistory.length > 0) {
        medicalHistoryDiv.innerHTML = patient.medicalHistory
            .map(
                (h) => `
										<div class="card" style="margin-bottom: 15px;">
												<div style="display: flex; justify-content: space-between; align-items: start;">
														<div>
																<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
																		<span class="badge badge-primary">${h.type}</span>
																		<span style="color: #6b7280; font-size: 14px;">${h.date}</span>
																		<span style="color: #6b7280; font-size: 14px;">• ${h.doctor}</span>
																</div>
																<h4 style="margin-bottom: 8px;">${h.diagnosis}</h4>
																<p style="color: #6b7280; font-size: 14px;">${h.notes}</p>
														</div>
												</div>
										</div>
								`,
            )
            .join("");
    } else {
        medicalHistoryDiv.innerHTML =
            '<p style="color: #6b7280;">No medical history available</p>';
    }
}

/* Switch Patient Medications Tab */
function viewPatientMedications(patient) {
    const medicationsDiv = document.getElementById("currentMedicationsList");
    if (patient.currentMedications && patient.currentMedications.length > 0) {
        medicationsDiv.innerHTML = patient.currentMedications
            .map(
                (m) => `
                    <div class="card" style="margin-bottom: 15px; background: var(--light);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="color: var(--primary); margin-bottom: 5px;">${m.name}</h4>
                                <p style="margin: 0;"><strong>Dosage:</strong> ${m.dose}</p>
                                <p style="margin: 0;"><strong>Frequency:</strong> ${m.frequency}</p>
                            </div>
                            <div style="font-size: 24px;">💊</div>
                        </div>
                    </div>
                `,
            )
            .join("");
    } else {
        medicationsDiv.innerHTML =
            '<p style="color: #6b7280;">No current medications</p>';
    }
}

/* Switch Patient Lab Reports Tab */
function viewPatientLabReports(patient) {
    const labReportsTable = document.getElementById("labReportsTable");
    if (patient.labReports && patient.labReports.length > 0) {
        labReportsTable.innerHTML = patient.labReports
            .map(
                (l) => `
                    <tr>
                        <td>${l.date}</td>
                        <td>${l.test}</td>
                        <td><span class="badge badge-${
                            l.result.includes("Normal") ? "success" : "warning"
                        }">${l.result}</span></td>
                        <td><button class="btn btn-outline" style="padding: 4px 12px; font-size: 12px;">📄 View</button></td>
                    </tr>
                `,
            )
            .join("");
    } else {
        labReportsTable.innerHTML =
            '<tr><td colspan="4" style="text-align: center; color: #6b7280;">No lab reports available</td></tr>';
    }
}

function viewPatientImmunizations(patient) {
    const immunizationsTable = document.getElementById("immunizationsTable");
    if (patient.immunizations && patient.immunizations.length > 0) {
        immunizationsTable.innerHTML = patient.immunizations
            .map((i) => {
                const isDue = new Date(i.nextDue) < new Date();
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
                            <td>${i.vaccine}</td>
                            <td>${i.date}</td>
                            <td>${i.nextDue}</td>
                            <td><span class="badge badge-${statusClass}">${status}</span></td>
                        </tr>
                    `;
            })
            .join("");
    } else {
        immunizationsTable.innerHTML =
            '<tr><td colspan="4" style="text-align: center; color: #6b7280;">No immunization records available</td></tr>';
    }
}

/**
 * Displays the patient details
 * @param {string} id - the id of the patient to be displayed.
 * @returns {string}  HTML string to be rendred by different functions
 */
function viewPatient(id) {
    const patient = patients.find((p) => p.id === id);
    if (!patient) return;

    viewPatientInfo(patient);
    viewPatientMedicalHistory(patient);
    viewPatientMedications(patient);
    viewPatientLabReports(patient);
    viewPatientImmunizations(patient);

    /* Reset to first tab */
    switchPatientTab("info");

    /* Open modal */
    openModal("viewPatientModal");
}

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

function editPatient() {
    closeModal("viewPatientModal");
    openModal("addPatientModal");
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
