/* patients page */

const patients = [
  {
    id: "P001",
    name: "John Doe",
    age: 35,
    gender: "Male",
    phone: "9876543210",
    email: "john@email.com",
    bloodGroup: "O+",
    address: "123 Main Street, Ahmedabad",
    emergencyContact: "9876543211",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    currentMedications: [
      { name: "Metformin", dose: "500mg", frequency: "Twice daily" },
      { name: "Lisinopril", dose: "10mg", frequency: "Once daily" },
    ],
    medicalHistory: [
      {
        date: "2024-01-10",
        type: "Consultation",
        doctor: "Dr. Smith",
        diagnosis: "Hypertension",
        notes: "Blood pressure elevated, started on Lisinopril",
      },
      {
        date: "2023-12-15",
        type: "Emergency",
        doctor: "Dr. Jones",
        diagnosis: "Acute Bronchitis",
        notes: "Prescribed antibiotics and rest",
      },
      {
        date: "2023-11-20",
        type: "Check-up",
        doctor: "Dr. Smith",
        diagnosis: "Routine Check-up",
        notes: "All vitals normal",
      },
    ],
    labReports: [
      {
        date: "2024-01-10",
        test: "Complete Blood Count",
        result: "Normal",
        file: "CBC_001.pdf",
      },
      {
        date: "2024-01-10",
        test: "Lipid Profile",
        result: "High Cholesterol",
        file: "LIPID_001.pdf",
      },
    ],
    immunizations: [
      { vaccine: "COVID-19", date: "2023-03-15", nextDue: "2024-03-15" },
      { vaccine: "Influenza", date: "2023-10-01", nextDue: "2024-10-01" },
    ],
  },
  {
    id: "P002",
    name: "Jane Smith",
    age: 28,
    gender: "Female",
    phone: "9876543211",
    email: "jane@email.com",
    bloodGroup: "A+",
    address: "456 Park Avenue, Ahmedabad",
    emergencyContact: "9876543212",
    allergies: ["Sulfa drugs"],
    chronicConditions: ["Asthma"],
    currentMedications: [
      { name: "Albuterol Inhaler", dose: "90mcg", frequency: "As needed" },
    ],
    medicalHistory: [
      {
        date: "2024-01-08",
        type: "Follow-up",
        doctor: "Dr. Williams",
        diagnosis: "Asthma Management",
        notes: "Well controlled on current medication",
      },
      {
        date: "2023-09-10",
        type: "Consultation",
        doctor: "Dr. Smith",
        diagnosis: "Migraine",
        notes: "Prescribed Sumatriptan for acute episodes",
      },
    ],
    labReports: [
      {
        date: "2023-12-20",
        test: "Thyroid Function",
        result: "Normal",
        file: "THYROID_002.pdf",
      },
    ],
    immunizations: [
      { vaccine: "COVID-19", date: "2023-04-20", nextDue: "2024-04-20" },
      { vaccine: "Tetanus", date: "2022-06-15", nextDue: "2032-06-15" },
    ],
  },
  {
    id: "P003",
    name: "Robert Johnson",
    age: 42,
    gender: "Male",
    phone: "9876543212",
    email: "robert@email.com",
    bloodGroup: "B+",
    address: "789 Lake Road, Ahmedabad",
    emergencyContact: "9876543213",
    allergies: [],
    chronicConditions: ["High Cholesterol"],
    currentMedications: [
      { name: "Atorvastatin", dose: "20mg", frequency: "Once daily at night" },
    ],
    medicalHistory: [
      {
        date: "2024-01-12",
        type: "Admission",
        doctor: "Dr. Williams",
        diagnosis: "Appendicitis",
        notes: "Appendectomy performed, recovery ongoing",
      },
      {
        date: "2023-10-05",
        type: "Consultation",
        doctor: "Dr. Jones",
        diagnosis: "High Cholesterol",
        notes: "Started on statin therapy",
      },
    ],
    labReports: [
      {
        date: "2024-01-05",
        test: "Lipid Profile",
        result: "Improving",
        file: "LIPID_003.pdf",
      },
      {
        date: "2024-01-12",
        test: "Pre-operative Panel",
        result: "Normal",
        file: "PREOP_003.pdf",
      },
    ],
    immunizations: [
      { vaccine: "COVID-19", date: "2023-05-10", nextDue: "2024-05-10" },
      { vaccine: "Hepatitis B", date: "2023-01-15", nextDue: "Completed" },
    ],
  },
  {
    id: "P069",
    name: "Ram Singh",
    age: 21,
    gender: "Male",
    phone: "1234123412",
    email: "ramsingh@email.com",
    bloodGroup: "B+",
    address: "789 Lake Road, Ahmedabad",
    emergencyContact: "9876543213",
    allergies: [],
    chronicConditions: ["High Cholesterol"],
    currentMedications: [
      { name: "Atorvastatin", dose: "20mg", frequency: "Once daily at night" },
    ],
    medicalHistory: [
      {
        date: "2024-01-12",
        type: "Admission",
        doctor: "Dr. Williams",
        diagnosis: "Appendicitis",
        notes: "Appendectomy performed, recovery ongoing",
      },
      {
        date: "2023-10-05",
        type: "Consultation",
        doctor: "Dr. Jones",
        diagnosis: "High Cholesterol",
        notes: "Started on statin therapy",
      },
    ],
    labReports: [
      {
        date: "2024-01-05",
        test: "Lipid Profile",
        result: "Improving",
        file: "LIPID_003.pdf",
      },
      {
        date: "2024-01-12",
        test: "Pre-operative Panel",
        result: "Normal",
        file: "PREOP_003.pdf",
      },
    ],
    immunizations: [
      { vaccine: "COVID-19", date: "2023-05-10", nextDue: "2024-05-10" },
      { vaccine: "Hepatitis B", date: "2023-01-15", nextDue: "Completed" },
    ],
  },
];

/* Initialize Patients Page */
function loadPatients() {
  // Update statistics
  document.getElementById("totalPatientsCount").textContent = patients.length;
  document.getElementById("newPatientsMonth").textContent = "2"; // Mock data
  document.getElementById("activePatients").textContent = patients.length - 1;
  document.getElementById("criticalPatients").textContent = "1"; // Mock data

  const table = document.getElementById("patientsTable");
  table.innerHTML = patients
    .map((patient) => {
      const lastVisit =
        patient.medicalHistory && patient.medicalHistory.length > 0
          ? patient.medicalHistory[0].date
          : "No visits";
      const hasAllergies = patient.allergies && patient.allergies.length > 0;
      const hasChronic =
        patient.chronicConditions && patient.chronicConditions.length > 0;
      const status = hasChronic ? "Chronic" : "Regular";
      const statusClass = hasChronic ? "warning" : "success";

      return `
                    <tr>
                        <td>${patient.id}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                ${patient.name}
                                ${hasAllergies
          ? '<span title="Has allergies" style="color: var(--danger);">!</span>'
          : ""
        }
                            </div>
                        </td>
                        <td>${patient.age}</td>
                        <td>${patient.gender}</td>
                        <td>${patient.phone}</td>
                        <td>${patient.bloodGroup || "Unknown"}</td>
                        <td>${lastVisit}</td>
                        <td><span class="badge badge-${statusClass}">${status}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-primary" onclick="viewPatient('${patient.id
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                                <button class="btn btn-outline" onclick="quickConsultation('${patient.id
        }')" style="padding: 6px 12px; font-size: 12px;">Consult</button>
                            </div>
                        </td>
                    </tr>
                `;
    })
    .join("");
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

/* Switch Patient Info Tab */
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
  document.getElementById("patientGenderDisplay").textContent = patient.gender;
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
								`
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
                `
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
                        <td><span class="badge badge-${l.result.includes("Normal") ? "success" : "warning"
          }">${l.result}</span></td>
                        <td><button class="btn btn-outline" style="padding: 4px 12px; font-size: 12px;">📄 View</button></td>
                    </tr>
                `
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
          i.nextDue === "Completed" ? "success" : isDue ? "danger" : "success";
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

/* View Patient Details */
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
      p.phone.includes(searchTerm)
  );

  const table = document.getElementById("patientsTable");
  table.innerHTML = filtered
    .map(
      (patient) => `
                <tr>
                    <td>${patient.id}</td>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.gender}</td>
                    <td>${patient.phone}</td>
                    <td>${patient.email}</td>
                    <td>
                        <button class="btn btn-primary" onclick="viewPatient('${patient.id}')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
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
