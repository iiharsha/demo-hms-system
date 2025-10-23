/** Initialize Patients Page
 * */
function loadPatients() {
    // Update statistics
    DOM.setValue("totalPatientsCount", patients.length);
    DOM.setValue("newPatientsMonth", 2);
    DOM.setValue("activePatients", patients.length - 1);
    DOM.setValue("criticalPatients", 1);

    const queueTable = patients
        .map((patient) => {
            return `
                    <tr>
                        <td>${patient.id}</td>
                        <td> ${patient.name}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn action-btn-primary" onclick="viewPatient('${patient.id}')" title="View Patient">
                                    <i class="ri-eye-line"></i>
                                </button>
                                <button class="action-btn action-btn-primary" onclick="openEditPatientPage('${patient.id}')" title="Edit Patient">
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

    DOM.setHTML("patientsInQueueTable", queueTable);
    const invoiceTable = invoices
        .map((invoice) => {
            return `
                    <tr>
                        <td>${invoice.id}</td>
                        <td> ${getPatientName(invoice.patientId)}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn action-btn-primary" onclick="viewPatient('${invoice.patientId}')" title="View Patient">
                                    <i class="ri-eye-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
        })
        .join("");

    DOM.setHTML("patientsTodaysInvoiceTable", invoiceTable);
}

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

function renderPatientActions(patientId) {
    return `
    <div class="action-buttons">
      <button class="btn btn-primary" onclick="viewPatient('${patientId}')">View</button>
      <button class="btn btn-outline" onclick="quickConsultation('${patientId}')">Consult</button>
    </div>
  `;
}

function quickConsultation(patientId) {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
        showNotification(`Starting consultation for ${patient.name}`);
        openNewConsultationModal();
    }
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
    setText("patientAgeDisplay", patient.age ? patient.age + " years" : "—");
    setText("patientGenderDisplay", patient.gender || "NA");
    setText("patientWeightDisplay", patient.medicalHistory[0].weight || "NA");
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
            .map((h) => {
                const medsHTML =
                    h.medications && h.medications.length > 0
                        ? `
                            <div class="mt-2 pl-4">
                                <h5 class="font-semibold mb-1 text-sm">Medications:</h5>
                                <ul class="list-disc pl-5 text-sm">
                                    ${h.medications
                                        .map(
                                            (m) => `
                                            <li>
                                                <strong>${m.name}</strong> — ${m.dose || "NA"} (${m.frequency || "NA"})
                                            </li>
                                        `,
                                        )
                                        .join("")}
                                </ul>
                            </div>
                          `
                        : "";

                const complainsHTML = h.complains
                    ? `
                        <div class="mt-2">
                            <h5 class="font-semibold mb-1 text-sm">Complains:</h5>
                            <p class="text-sm text-gray-700">${h.complains}</p>
                        </div>
                      `
                    : "";

                return `
                    <div class="card mb-3 p-3">
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="uppercase font-semibold">${formatDate(h.date)}</span>
                                    <span class="text-xs text-gray-500">${h.type || "—"}</span>
                                </div>
                                <div class="pl-2 mt-1">
                                    <h4 class="font-semibold">${h.diagnosis || "—"}</h4>
                                    <p class="text-sm text-gray-700">${h.notes || ""}</p>
                                    ${complainsHTML}
                                    ${medsHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            })
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
            return `
              <tr>
              <td>${patient.id}</td>
              <td>${patient.name}</td>
              <td>
                <div class="action-buttons">
                    <button class="action-btn action-btn-primary" onclick="viewPatient('${patient.id}')" title="View Patient">
                        <i class="ri-eye-line"></i>
                    </button>
                    <button class="action-btn action-btn-primary" onclick="openEditPatientPage('${patient.id}')" title="Edit Patient">
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
}

let currentEditingPatientId = null;

/**
 * Opens the Edit Patient page with prefilled data.
 */
function openEditPatientPage(patientId) {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return showNotification("Patient not found");

    currentEditingPatientId = patientId;

    // Hide other sections
    document.getElementById("patients-page")?.classList.add("hide");
    document.getElementById("view-patient-page")?.classList.remove("active");
    document.getElementById("edit-patient-page")?.classList.add("active");

    // Prefill fields
    const [firstName, ...lastParts] = (patient.name || "").split(" ");
    document.getElementById("editPatientFirstName").value = firstName || "";
    document.getElementById("editPatientLastName").value =
        lastParts.join(" ") || "";
    document.getElementById("editPatientAge").value = patient.age || "";
    document.getElementById("editPatientGender").value = patient.gender || "";
    document.getElementById("editPatientPhone").value = patient.phone || "";
    document.getElementById("editPatientEmail").value = patient.email || "";
    document.getElementById("editPatientAddress").value = patient.address || "";
}

/**
 * Save edited patient data and refresh UI
 */
function saveEditedPatient(event) {
    event.preventDefault();
    if (!currentEditingPatientId) return;

    const patient = patients.find((p) => p.id === currentEditingPatientId);
    if (!patient) return showNotification("Patient not found");

    // Update fields
    patient.name =
        document.getElementById("editPatientFirstName").value.trim() +
        " " +
        document.getElementById("editPatientLastName").value.trim();
    patient.age = parseInt(
        document.getElementById("editPatientAge").value.trim(),
    );
    patient.gender = document.getElementById("editPatientGender").value;
    patient.phone = document.getElementById("editPatientPhone").value.trim();
    patient.email = document.getElementById("editPatientEmail").value.trim();
    patient.address = document
        .getElementById("editPatientAddress")
        .value.trim();

    showNotification("Patient details updated successfully!");

    // Refresh data and UI
    loadPatients();
    initializeDashboard?.();

    // Return to view mode
    backToPatients();
}

/**
 * Save a new patient from the Add Patient Queue form
 */
function saveDashboardPatient() {
    const name = document.getElementById("addPatientQueueName").value.trim();
    const age = parseInt(document.getElementById("addPatientQueueAge").value);
    const weight = parseFloat(
        document.getElementById("addPatientQueueWeight").value,
    );
    const gender = document.getElementById("addPatientQueueSex").value;
    const phone = document.getElementById("addPatientQueuePhone").value.trim();
    const address = document
        .getElementById("addPatientQueueAddress")
        .value.trim();

    const complainInputs = document.querySelectorAll(
        'input[name="complain"]:checked',
    );
    const complains = Array.from(complainInputs).map((input) => input.value);

    // Validation
    if (!name || !age || !gender || !phone) {
        showNotification("Please fill in all required fields.", "error");
        return;
    }

    // Create a new patient object
    const newPatient = {
        id: "PT" + String(patients.length + 1).padStart(3, "0"),
        name,
        age,
        gender,
        phone,
        address,
        medicalHistory: [
            {
                date: new Date().toISOString().split("T")[0],
                type: "Consultation",
                doctor: "Dr. Smith",
                diagnosis: "General Checkup",
                complains: complains.length ? complains.join(", ") : "None",
                weight: weight ? `${weight}kg` : "NA",
                notes: "",
                medications: [],
            },
        ],
        labReports: [],
    };

    // Add to global patients list
    patients.push(newPatient);

    // Re-render patient tables
    if (typeof loadPatients === "function") loadPatients();

    // Reset form fields
    resetAddPatientQueueForm();

    showNotification(`Patient ${name} added successfully!`);
}

/**
 * Go back from edit/view page to patient list.
 */
function backToPatients() {
    document.getElementById("edit-patient-page")?.classList.remove("active");
    document.getElementById("view-patient-page")?.classList.remove("active");
    document.getElementById("patients-page")?.classList.remove("hide");
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

function getPatientDetails(patientId) {
    return patients.find((p) => p.id === patientId) || null;
}

function getPatientName(patientId) {
    const patient = getPatientDetails(patientId);
    return patient ? patient.name : "Unknown";
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

// TODO look into this
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
