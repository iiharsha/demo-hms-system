/* Consultations Page */

const consultations = [
  {
    id: "C001",
    date: "2024-01-14",
    time: "10:00",
    patient: "John Doe",
    doctor: "Dr. Smith",
    diagnosis: "Flu",
    status: "Completed",
  },
  {
    id: "C002",
    date: "2024-01-14",
    time: "11:00",
    patient: "Jane Smith",
    doctor: "Dr. Jones",
    diagnosis: "Migraine",
    status: "Completed",
  },
  {
    id: "C003",
    date: "2024-01-15",
    time: "12:00",
    patient: "Donald Trump",
    doctor: "Dr. Williams",
    diagnosis: "Ear Condition",
    status: "Scheduled",
  },
  {
    id: "C004",
    date: "2025-01-15",
    time: "15:00",
    patient: "Micheal Jackson",
    doctor: "Dr. Smith",
    diagnosis: "Skin Rash",
    status: "Scheduled",
  },
];

/**
 * Initlialize the Cosultations page
 */
function loadConsultations() {
  const html = consultations
    .map(
      (consult) => `
                <tr>
                    <td>${consult.id}</td>
                    <td>${consult.date}</td>
                    <td>${consult.time}</td>
                    <td>${consult.patient}</td>
                    <td>${consult.doctor}</td>
                    <td>${consult.diagnosis}</td>
                    <td><span class="badge badge-${consult.status === "Completed" ? "success" : "primary"}">${consult.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewConsultation('${consult.id}')">View</button>
                    </td>
                </tr>
            `
    )
    .join("");
  DOM.setHTML("consultationsTable", html);
}

function saveConsultation() {
  const newConsultation = {
    id: "C" + String(consultations.length + 1).padStart(3, "0"),
    date: new Date().toISOString().split("T")[0],
    patient: patients[0].name, // Default to first patient for demo
    doctor: "Dr. Smith",
    diagnosis: document.getElementById("diagnosis").value || "General Checkup",
    status: "Completed",
  };

  consultations.push(newConsultation);
  loadConsultations();
  closeModal("newConsultationModal");
  showNotification("Consultation saved successfully!");
}

/* Search Consultations */
function searchConsultations() {
  const searchTerm = DOM.getValue("consultationSearch").toLowerCase();
  const filtered = consultations.filter(
    (c) =>
      c.patient.toLowerCase().includes(searchTerm) ||
      c.doctor.toLowerCase().includes(searchTerm) ||
      c.diagnosis.toLowerCase().includes(searchTerm)
  );

  const html = filtered
    .map(
      (consult) => `
                <tr>
                    <td>${consult.id}</td>
                    <td>${consult.date}</td>
                    <td>${consult.time}</td>
                    <td>${consult.patient}</td>
                    <td>${consult.doctor}</td>
                    <td>${consult.diagnosis}</td>
                    <td><span class="badge badge-success">${consult.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewConsultation('${consult.id}')">View</button>
                    </td>
                </tr>
            `
    )
    .join("");

  DOM.setHTML("consultationsTable", html);
}

function viewConsultation(id) {
  const consultation = consultations.find(c => c.id === id);
  if (!consultation) {
    showNotification("Consultation not found", "error");
    return;
  }

  const modalBody = DOM.get("viewConsultationModalBody");

  modalBody.innerHTML = `
    <div class="table-container">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Consultation Info</h4>
        </div>
        <div class="card-body">
          <table class="table">
            <tbody>
              <tr>
                <td><strong>ID</strong></td>
                <td>${consultation.id}</td>
              </tr>
              <tr>
                <td><strong>Date</strong></td>
                <td>${consultation.date}</td>
              </tr>
              <tr>
                <td><strong>Time</strong></td>
                <td>${consultation.time}</td>
              </tr>
              <tr>
                <td><strong>Patient</strong></td>
                <td>${consultation.patient}</td>
              </tr>
              <tr>
                <td><strong>Doctor</strong></td>
                <td>${consultation.doctor}</td>
              </tr>
              <tr>
                <td><strong>Diagnosis</strong></td>
                <td>${consultation.diagnosis}</td>
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                <td>
                  <span class="badge badge-${consultation.status === "Completed" ? "success" : "primary"}">
                    ${consultation.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  openModal("viewConsultationModal");
}

/**
 * Opens the "Add Appointment" modal and populates patient dropdown
 * @return {void}
 */
function openNewConsultationModal() {
  populateConsultationPatientDropdown();
  populateAppointmentDoctorDropdown();

  const dateInput = DOM.get("consultationDateInput");
  if (dateInput && !dateInput.value)
    dateInput.value = new Date().toISOString().split("T")[0];

  openModal("newConsultationModal");

  setTimeout(() => {
    refreshTimeSlots(); // uses selected doctor & date
  }, 100);

  // Re-generate when user changes doctor/date
  DOM.get("consultationDoctor")?.addEventListener("change", refreshTimeSlots);
  DOM.get("consultationDateInput")?.addEventListener("change", refreshTimeSlots);
}

/**
 * Populate patient dropdown with searchable patient list
 */
function populateConsultationPatientDropdown() {
  const patientSelect = DOM.get("searchConsultationPatient");

  if (!patientSelect) {
    console.error("Patient select element not found");
    return;
  }

  // Check if we need to convert to searchable input
  if (patientSelect.tagName === "SELECT") {
    // Replace select with searchable input structure
    const container = patientSelect.parentElement;
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.innerHTML = `
      <input type="text" 
             id="consultationPatientSearch" 
             placeholder="Search patient..."
             autocomplete="off">
      <div id="consultationPatientSearchResults" 
        class="hidden absolute bg-white border rounded-sm shadow mt-1"
           style="top: 100%; left: 0; right: 0; max-height: 300px; overflow-y: auto; z-index: 1000;"></div>
      <input type="hidden" id="consultationPatientId" value="">
      <div class="mt-2">
        <button type="button" class="btn btn-outline" onclick="navigateToAddPatient()">
          <i class="ri-add-line"></i> Add New Patient
        </button>
      </div>
    `;

    container.replaceChild(wrapper, patientSelect);

    // Add event listeners
    setupConsultationPatientSearch();
  } else {
    // Already converted, just setup search again
    setupConsultationPatientSearch();
  }
}

/**
 * Setup patient search functionality
 */
function setupConsultationPatientSearch() {
  const searchInput = DOM.get("consultationPatientSearch");
  const resultsDiv = DOM.get("consultationPatientSearchResults");
  const hiddenInput = DOM.get("consultationPatientId");

  if (!searchInput || !resultsDiv) return;

  let selectedPatient = null;

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();

    if (searchTerm.length < 1) {
      resultsDiv.style.display = 'none';
      hiddenInput.value = '';
      selectedPatient = null;
      return;
    }

    // Filter patients
    const filteredPatients = patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm) ||
      p.phone.includes(searchTerm) ||
      (p.email && p.email.toLowerCase().includes(searchTerm))
    );

    if (filteredPatients.length === 0) {
      resultsDiv.innerHTML = `
        <div class="p-4 text-center text-gray-50">
          No patients found. 
        </div>
      `;
      resultsDiv.style.display = 'block';
      return;
    }

    resultsDiv.innerHTML = filteredPatients.map(p => {
      const hasAllergies = p.allergies && p.allergies.length > 0;
      return `
        <div class="patient-search-item" data-patient-id="${p.id}" 
             style="padding: 12px; cursor: pointer; border-bottom: 1px solid #f3f4f6;
                    transition: background-color 0.2s;">
          <div style="font-weight: 600; color: #111827;">${p.name}</div>
          <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">
            ${p.id} • ${p.age}y, ${p.gender} • ${p.phone}
            ${hasAllergies ? `<span style="color: var(--danger); margin-left: 8px;" title="Has allergies">⚠</span>` : ''}
          </div>
          ${p.bloodGroup ? `<div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">Blood Group: ${p.bloodGroup}</div>` : ''}
        </div>
      `;
    }).join('');

    resultsDiv.style.display = 'block';

    // Add click handlers
    resultsDiv.querySelectorAll('.patient-search-item').forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f9fafb';
      });
      item.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
      });
      item.addEventListener('click', function() {
        const patientId = this.dataset.patientId;
        selectedPatient = patients.find(p => p.id === patientId);

        if (selectedPatient) {
          searchInput.value = selectedPatient.name;
          hiddenInput.value = selectedPatient.id;
          resultsDiv.style.display = 'none';

          // Show patient info
          showSelectedConsultationPatientInfo(selectedPatient);
        }
      });
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
      resultsDiv.style.display = 'none';
    }
  });
}

/**
 * Show selected patient information
 * @param {Object} patient - The selected patient object
 */
function showSelectedConsultationPatientInfo(patient) {
  let infoDiv = DOM.get("selectedPatientInfo");

  if (!infoDiv) {
    const searchWrapper = DOM.get("consultationPatientSearch").parentElement;
    infoDiv = DOM.createElement('div');
    infoDiv.id = "selectedPatientInfo";
    searchWrapper.appendChild(infoDiv);
  }

  const hasAllergies = patient.allergies && patient.allergies.length > 0;
  const hasChronic = patient.chronicConditions && patient.chronicConditions.length > 0;

  infoDiv.innerHTML = `
    <div class="card" class="mt-2 p-2 bg-gray-50">
      <div class="flex justify-between items-start">
        <div>
          <div class="font-semibold mt-1">${patient.name}</div>
          <div class="text-xs text-gray-300">
            ${patient.age}y, ${patient.gender} • ${patient.bloodGroup || "Unknown"}
          </div>
          ${hasAllergies ? `
            <div class="mt-1">
              <strong class="text-xs text-danger">⚠ Allergies:</strong>
              ${patient.allergies.map(a => `<span class="badge badge-danger text-xs ml-1">${a}</span>`).join('')}
            </div>
          ` : ''}
          ${hasChronic ? `
            <div class="mt-1">
              <strong>Conditions:</strong>
              ${patient.chronicConditions.map(c => `<span class="badge badge-warning">${c}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <button onclick="clearSelectedPatient()" class="btn btn-outline">Change</button>
      </div>
    </div>
  `;
}

/**
 * Clear selected patient
 */
function clearSelectedPatient() {
  const searchInput = DOM.get("consultationPatientSearch");
  const hiddenInput = DOM.get("consultationPatientId");
  const infoDiv = DOM.get("selectedPatientInfo");

  if (searchInput) searchInput.value = '';
  if (hiddenInput) hiddenInput.value = '';
  if (infoDiv) infoDiv.innerHTML = '';
}

/**
 * Populate doctor dropdown
 */
function populateAppointmentDoctorDropdown() {
  const doctorSelect = DOM.get("consultationDoctor");

  if (!doctorSelect) return;

  // Extract unique doctors from existing appointments and patients' medical history
  const doctorSet = new Set();

  appointments.forEach(apt => {
    if (apt.doctor) doctorSet.add(apt.doctor);
  });

  patients.forEach(p => {
    if (p.medicalHistory) {
      p.medicalHistory.forEach(h => {
        if (h.doctor) doctorSet.add(h.doctor);
      });
    }
  });

  const doctors = Array.from(doctorSet).sort();

  doctorSelect.innerHTML = `
    <option value="">Select Doctor</option>
    ${doctors.map(d => `<option value="${d}">${d}</option>`).join('')}
  `;
}

/**
 * Navigate to patients page and open add patient modal
 */
function navigateToAddPatient() {
  // Close current modal
  closeModal("newConsultationModal");

  // Navigate to patients page
  if (typeof showPage === 'function') {
    showPage('patients.html');

    // Wait for page to load, then open add patient modal
    setTimeout(() => {
      if (typeof openAddPatientModal === 'function') {
        openAddPatientModal();
      } else {
        openModal("addPatientModal");
      }
    }, 300);
  } else {
    // Fallback: just open the add patient modal
    openModal("addPatientModal");
  }
}

/**
 * Saves a new appointment from form input and adds it to the list.
 * @returns {void}
 */
function saveAppointment() {
  const patientId = DOM.get("consultationPatientId")?.value;
  const date = DOM.get("consultationDateInput")?.value;
  const doctor = DOM.get("consultationDoctor")?.value;
  const type = DOM.get("consultationType")?.value;
  const notes = DOM.get("consultationNotes")?.value;

  // Get selected time slot
  const selectedSlot = DOM.querySelector(".appointment-slot.selected");

  // Validation
  if (!patientId) {
    showNotification("Please select a patient", "error");
    return;
  }

  if (!date) {
    showNotification("Please select a date", "error");
    return;
  }

  if (!selectedSlot) {
    showNotification("Please select a time slot", "error");
    return;
  }

  if (!doctor) {
    showNotification("Please select a doctor", "error");
    return;
  }

  if (!type) {
    showNotification("Please select appointment type", "error");
    return;
  }

  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    showNotification("Patient not found", "error");
    return;
  }

  const time = selectedSlot.dataset.time;

  // Check for duplicate appointments
  const duplicate = appointments.find(a =>
    a.date === date &&
    a.time === time &&
    a.doctor === doctor &&
    a.status === "Scheduled"
  );

  if (duplicate) {
    showNotification("This time slot is already booked with this doctor", "error");
    return;
  }

  /** @type {Appointment} */
  const newAppointment = {
    id: "A" + String(appointments.length + 1).padStart(3, "0"),
    date: date,
    time: time,
    patientId: patient.id,
    patientName: patient.name,
    doctor: doctor,
    type: type,
    status: "Scheduled",
    notes: notes || ""
  };

  appointments.push(newAppointment);

  // Add to patient's medical history
  if (patient.medicalHistory) {
    patient.medicalHistory.unshift({
      date: date,
      type: type,
      doctor: doctor,
      diagnosis: "Scheduled Appointment",
      notes: `Appointment scheduled for ${time}`
    });
  }

  loadAppointments();
  closeModal("newConsultationModal");
  showNotification(`Consultation scheduled for ${patient.name} on ${date} at ${time}`);

  if (typeof initializeDashboard === 'function') {
    initializeDashboard();
  }

  // Clear form
  clearAppointmentForm();
}
