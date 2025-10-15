/* Appointments Page */

/**
 * @typedef {Object} Appointment
 * @property {string} id - Appointment ID
 * @property {string} date - Appointment date (YYYY-MM-DD)
 * @property {string} time - Appointment time (HH:mm)
 * @property {string} patientId - Patient ID reference
 * @property {string} patientName - Patient name
 * @property {string} doctor - Doctor name
 * @property {string} type - Appointment type (Consultation/Follow-up/Check-up)
 * @property {"Scheduled"|"Completed"|"Cancelled"} status - Appointment status
 * @property {string} [notes] - Additional notes for the appointment
 */

/** @type {Appointment[]} */
const appointments = [];

/**
 * Initialize appointments with some sample data linked to existing patients
 */
function initializeAppointments() {
  // Only initialize if appointments array is empty
  if (appointments.length > 0) return;

  // Add some sample appointments using real patient data
  const sampleAppointments = [
    {
      id: "A001",
      date: "2024-01-15",
      time: "10:00",
      patientId: "P001",
      patientName: "John Doe",
      doctor: "Dr. Smith",
      type: "Consultation",
      status: "Completed",
      notes: "Regular checkup for hypertension"
    },
    {
      id: "A002",
      date: "2024-01-15",
      time: "11:00",
      patientId: "P002",
      patientName: "Jane Smith",
      doctor: "Dr. Jones",
      type: "Follow-up",
      status: "Completed",
      notes: "Asthma follow-up"
    },
    {
      id: "A003",
      date: "2025-01-20",
      time: "14:00",
      patientId: "P003",
      patientName: "Robert Johnson",
      doctor: "Dr. Williams",
      type: "Follow-up",
      status: "Scheduled",
      notes: "Post-surgery follow-up"
    }
  ];

  appointments.push(...sampleAppointments);
}

/**
 * Loads all appointments into the table on the page.
 * @returns {void}
 */
function loadAppointments() {
  // Ensure appointments are initialized
  if (appointments.length === 0) {
    initializeAppointments();
  }

  updateAppointmentStats();
  renderAppointments(appointments);
}

/**
 * Update appointment statistics
 */
function updateAppointmentStats() {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today).length;
  const scheduledAppointments = appointments.filter(a => a.status === "Scheduled").length;

  const todayCountEl = DOM.get("todayAppointments");
  const scheduledCountEl = DOM.get("scheduledAppointments");

  if (todayCountEl) todayCountEl.textContent = todayAppointments;
  if (scheduledCountEl) scheduledCountEl.textContent = scheduledAppointments;
}

/**
 * Filters appointments by date.
 * @param {Appointment[]} data - Array of appointment objects.
 * @param {string} date - Date to filter by (YYYY-MM-DD).
 * @returns {Appointment[]} Filtered appointments matching the date.
 */
function filterAppointmentsByDate(data, date) {
  if (!date) return data;
  return data.filter((a) => a.date === date);
}

/**
 * Filters appointments by doctor.
 * @param {Appointment[]} data - Array of appointment objects.
 * @param {string} doctor - Doctor's name (may come in format "ID - Name").
 * @returns {Appointment[]} Filtered appointments for the given doctor.
 */
function filterAppointmentsByDoctor(data, doctor) {
  if (!doctor) return data;
  const doctorName = doctor.includes("-") ? doctor.split("-")[1].trim() : doctor;
  return data.filter((a) =>
    a.doctor.toLowerCase().includes(doctorName.toLowerCase())
  );
}

/**
 * Render the given list of appointments into the table.
 * @param {Appointment[]} filteredAppointments - List of appointments to render.
 * @returns {void}
 */
function renderAppointments(filteredAppointments) {
  const table = DOM.get("appointmentsTable");

  if (!table) {
    console.error("Appointments table element not found");
    return;
  }

  if (filteredAppointments.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: #6b7280; padding: 20px;">
          No appointments found
        </td>
      </tr>
    `;
    return;
  }

  table.innerHTML = filteredAppointments
    .map((apt) => {
      const statusClass = apt.status === "Completed" ? "success" :
        apt.status === "Cancelled" ? "danger" : "primary";

      return `
        <tr>
          <td>${apt.id}</td>
          <td>${apt.date}</td>
          <td>${apt.time}</td>
          <td>${apt.patientName}</td>
          <td>${apt.doctor}</td>
          <td>${apt.type}</td>
          <td><span class="badge badge-${statusClass}">${apt.status}</span></td>
          <td>
            <button class="btn btn-primary" onclick="viewAppointment('${apt.id}')">View</button>
            ${apt.status === "Scheduled" ? `
              <button class="btn btn-outline" onclick="cancelAppointment('${apt.id}')">Cancel</button>
            ` : ''}
          </td>
        </tr>
      `;
    })
    .join("");
}

/**
 * Applies filter (date + doctor) and re-renders the appointment list.
 * @returns {void}
 */
function filterAppointments() {
  const date = DOM.get("appointmentDate")?.value;
  const doctor = DOM.get("doctorFilter")?.value;

  let filtered = appointments;

  filtered = filterAppointmentsByDate(filtered, date);
  filtered = filterAppointmentsByDoctor(filtered, doctor);

  renderAppointments(filtered);
}

/**
 * Opens a modal with details of the selected appointment.
 * @param {string} id - Appointment ID to view.
 * @returns {void}
 */
function viewAppointment(id) {
  const apt = appointments.find(a => a.id === id);
  if (!apt) {
    showNotification("Appointment not found", "error");
    return;
  }

  const patient = patients.find(p => p.id === apt.patientId);
  const modalBody = DOM.get("viewAppointmentModalBody");

  modalBody.innerHTML = `
    <div class="table-container" style="display: grid; gap: 1.5rem;">
      
      <!-- Appointment Details Card -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Appointment Info</h4>
        </div>
        <div class="card-body">
          <table class="table">
            <tbody>
              <tr>
                <td><strong>ID</strong></td>
                <td>${apt.id}</td>
              </tr>
              <tr>
                <td><strong>Date</strong></td>
                <td>${apt.date}</td>
              </tr>
              <tr>
                <td><strong>Time</strong></td>
                <td>${apt.time}</td>
              </tr>
              <tr>
                <td><strong>Type</strong></td>
                <td>${apt.type}</td>
              </tr>
              <tr>
                <td><strong>Doctor</strong></td>
                <td>${apt.doctor}</td>
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                <td>
                  <span class="badge badge-${apt.status === "Completed"
      ? "success"
      : apt.status === "Cancelled"
        ? "danger"
        : "primary"}">
                    ${apt.status}
                  </span>
                </td>
              </tr>
              ${apt.notes ? `
              <tr>
                <td><strong>Notes</strong></td>
                <td>${apt.notes}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      </div>

      ${patient ? `
      <!-- Patient Information Card -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Patient Info</h4>
        </div>
        <div class="card-body">
          <table class="table">
            <tbody>
              <tr>
                <td><strong>Patient Name</strong></td>
                <td>${patient.name}</td>
              </tr>
              <tr>
                <td><strong>Patient ID</strong></td>
                <td>${patient.id}</td>
              </tr>
              <tr>
                <td><strong>Age</strong></td>
                <td>${patient.age} years</td>
              </tr>
              <tr>
                <td><strong>Phone</strong></td>
                <td>${patient.phone}</td>
              </tr>
              <tr>
                <td><strong>Blood Group</strong></td>
                <td>${patient.bloodGroup || "Unknown"}</td>
              </tr>
              ${patient.allergies && patient.allergies.length > 0 ? `
              <tr>
                <td><strong>Allergies</strong></td>
                <td>
                  ${patient.allergies.map(a => `<span class="badge badge-danger">${a}</span>`).join(' ')}
                </td>
              </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      </div>
      ` : ''}

    </div>
  `;

  openModal("viewAppointmentModal");
}

/**
 * Cancel an appointment
 * @param {string} appointmentId - The appointment ID to cancel
 */
function cancelAppointment(appointmentId) {
  const appointment = appointments.find(a => a.id === appointmentId);

  if (!appointment) {
    showNotification("Appointment not found", "error");
    return;
  }

  if (appointment.status === "Cancelled") {
    showNotification("Appointment already cancelled", "error");
    return;
  }

  if (!confirm(`Are you sure you want to cancel the appointment for ${appointment.patientName}?`)) {
    return;
  }

  appointment.status = "Cancelled";

  loadAppointments();
  showNotification(`Appointment cancelled for ${appointment.patientName}`);

  if (typeof initializeDashboard === 'function') {
    initializeDashboard();
  }
}

/**
 * Opens the "Add Appointment" modal and populates patient dropdown
 * @return {void}
 */
function openAddAppointmentModal() {
  populateAppointmentPatientDropdown();
  populateAppointmentDoctorDropdown();

  const dateInput = DOM.get("appointmentDateInput");
  if (dateInput && !dateInput.value)
    dateInput.value = new Date().toISOString().split("T")[0];

  openModal("addAppointmentModal");

  setTimeout(() => {
    refreshTimeSlots(); // uses selected doctor & date
  }, 100);

  // Re-generate when user changes doctor/date
  DOM.get("appointmentDoctor")?.addEventListener("change", refreshTimeSlots);
  DOM.get("appointmentDateInput")?.addEventListener("change", refreshTimeSlots);
}

/**
 * Populate patient dropdown with searchable patient list
 */
function populateAppointmentPatientDropdown() {
  const patientSelect = DOM.get("appointmentPatient");

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
             id="appointmentPatientSearch" 
             placeholder="Search patient by name, ID, or phone..."
             autocomplete="off">
      <div id="patientSearchResults" 
           style="display: none; position: absolute; top: 100%; left: 0; right: 0; 
                  background: white; border: 1px solid #d1d5db; border-radius: 8px; 
                  max-height: 300px; overflow-y: auto; z-index: 1000; margin-top: 4px;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></div>
      <input type="hidden" id="appointmentPatientId" value="">
      <div style="margin-top: 8px;">
        <button type="button" class="btn btn-outline" onclick="navigateToAddPatient()">
          <i class="ri-add-line"></i> Add New Patient
        </button>
      </div>
    `;

    container.replaceChild(wrapper, patientSelect);

    // Add event listeners
    setupPatientSearch();
  } else {
    // Already converted, just setup search again
    setupPatientSearch();
  }
}

/**
 * Setup patient search functionality
 */
function setupPatientSearch() {
  const searchInput = DOM.get("appointmentPatientSearch");
  const resultsDiv = DOM.get("patientSearchResults");
  const hiddenInput = DOM.get("appointmentPatientId");

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
        <div class="p-2 text-center">
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
          showSelectedPatientInfo(selectedPatient);
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
function showSelectedPatientInfo(patient) {
  let infoDiv = DOM.get("selectedPatientInfo");

  if (!infoDiv) {
    const searchWrapper = DOM.get("appointmentPatientSearch").parentElement;
    infoDiv = DOM.createElement('div');
    infoDiv.id = "selectedPatientInfo";
    searchWrapper.appendChild(infoDiv);
  }

  const hasAllergies = patient.allergies && patient.allergies.length > 0;
  const hasChronic = patient.chronicConditions && patient.chronicConditions.length > 0;

  infoDiv.innerHTML = `
    <div class="card" class="mt-3 p-3">
      <div class="flex justify-between items-start">
        <div>
          <div class="font-semibold mt-1">${patient.name}</div>
          <div class="text-xs text-gray-300">
            ${patient.age}y, ${patient.gender} • ${patient.bloodGroup || "Unknown"}
          </div>
          ${hasAllergies ? `
            <div style="margin-top: 8px;">
              <strong style="font-size: 13px; color: var(--danger);">⚠ Allergies:</strong>
              ${patient.allergies.map(a => `<span class="badge badge-danger" style="font-size: 11px; margin-left: 4px;">${a}</span>`).join('')}
            </div>
          ` : ''}
          ${hasChronic ? `
            <div style="margin-top: 6px;">
              <strong style="font-size: 13px;">Conditions:</strong>
              ${patient.chronicConditions.map(c => `<span class="badge badge-warning" style="font-size: 11px; margin-left: 4px;">${c}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <button onclick="clearSelectedPatient()" class="btn btn-outline" 
                style="padding: 4px 8px; font-size: 12px;">Change</button>
      </div>
    </div>
  `;
}

/**
 * Clear selected patient
 */
function clearSelectedPatient() {
  const searchInput = DOM.get("appointmentPatientSearch");
  const hiddenInput = DOM.get("appointmentPatientId");
  const infoDiv = DOM.get("selectedPatientInfo");

  if (searchInput) searchInput.value = '';
  if (hiddenInput) hiddenInput.value = '';
  if (infoDiv) infoDiv.innerHTML = '';
}

/**
 * Populate doctor dropdown
 */
function populateAppointmentDoctorDropdown() {
  const doctorSelect = DOM.get("appointmentDoctor");

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
  closeModal("addAppointmentModal");

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
  const patientId = DOM.get("appointmentPatientId")?.value;
  const date = DOM.get("appointmentDateInput")?.value;
  const doctor = DOM.get("appointmentDoctor")?.value;
  const type = DOM.get("appointmentType")?.value;
  const notes = DOM.get("appointmentNotes")?.value;

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
  closeModal("addAppointmentModal");
  showNotification(`Appointment scheduled for ${patient.name} on ${date} at ${time}`);

  if (typeof initializeDashboard === 'function') {
    initializeDashboard();
  }

  // Clear form
  clearAppointmentForm();
}

/**
 * Initialize time slot selection
 */
function initializeTimeSlots() {
  const timeSlots = document.querySelectorAll(".appointment-slot");

  timeSlots.forEach(slot => {
    slot.addEventListener('click', function() {
      // Remove selected class from all slots
      timeSlots.forEach(s => s.classList.remove('selected'));

      // Add selected class to clicked slot
      this.classList.add('selected');

      // Visual feedback
      console.log('Selected time:', this.dataset.time);
    });
  });
}

/**
 * Dynamically generates interactive time slots for appointment scheduling.
 * - Prevents selecting booked or past time slots.
 * - Supports easy future integration with backend APIs.
 * - Cleanly handles re-rendering and state.
 *
 * @param {string} [selectedDoctor] - Doctor to filter booked slots.
 * @param {string} [selectedDate] - Date (YYYY-MM-DD) to filter booked slots.
 */
function generateTimeSlots(selectedDoctor, selectedDate) {
  const container = DOM.get("timeSlotsContainer");
  if (!container) {
    console.warn("[Appointments] Missing #timeSlotsContainer element");
    return;
  }

  // Resolve date context
  const date = selectedDate || DOM.get("appointmentDateInput")?.value;
  const doctor = selectedDoctor || DOM.get("appointmentDoctor")?.value;

  // Clear container
  container.innerHTML = "";

  // Define slot range (9:00 - 17:00)
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    slots.push(`${String(hour).padStart(2, "0")}:30`);
  }

  // Collect booked slots (for selected doctor & date)
  const bookedSlots = new Set(
    appointments
      .filter(a => a.date === date && a.doctor === doctor && a.status === "Scheduled")
      .map(a => a.time)
  );

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const isToday = date === today;

  // Build slot HTML
  const grid = DOM.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 1fr))";
  grid.style.gap = "10px";

  slots.forEach(time => {
    const slot = DOM.createElement("div");
    slot.textContent = time;
    slot.dataset.time = time;
    slot.classList.add("appointment-slot");

    // Determine slot state
    const slotDateTime = new Date(`${date}T${time}:00`);
    const isPast = isToday && slotDateTime < now;
    const isBooked = bookedSlots.has(time);

    if (isPast || isBooked) {
      slot.classList.add("disabled");
      slot.title = isPast ? "Past time slot" : "Already booked";
    } else {
      slot.addEventListener("click", onTimeSlotClick);
    }

    grid.appendChild(slot);
  });

  container.appendChild(grid);

  // Apply consistent styles (create once)
  if (!DOM.get("timeSlotStyles")) {
    const style = DOM.createElement("style");
    style.id = "timeSlotStyles";
    style.textContent = `
      .appointment-slot {
        padding: 10px;
        text-align: center;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        background: white;
        transition: all 0.2s ease;
        user-select: none;
      }
      .appointment-slot:hover:not(.disabled):not(.selected) {
        background-color: #f3f4f6;
        border-color: var(--primary);
      }
      .appointment-slot.selected {
        background-color: var(--primary);
        color: white;
        border-color: var(--primary);
        font-weight: 600;
      }
      .appointment-slot.disabled {
        background-color: #f9fafb;
        color: #9ca3af;
        cursor: not-allowed;
        border-color: #e5e7eb;
      }
    `;
    DOM.head.appendChild(style);
  }
}

/**
 * Handles clicking a time slot — toggles selection visually & logically.
 * @param {MouseEvent} event
 */
function onTimeSlotClick(event) {
  const slot = event.currentTarget;
  if (slot.classList.contains("disabled")) return;

  // Deselect other slots
  document.querySelectorAll(".appointment-slot.selected")
    .forEach(s => s.classList.remove("selected"));

  // Select current
  slot.classList.add("selected");
}

/**
 * Refreshes available slots when date or doctor changes.
 * Designed for easy API integration later.
 */
function refreshTimeSlots() {
  /**
   * Generate time slots dynamically if they don't exist
   */
  function generateTimeSlots() {
    const container = DOM.get("timeSlotsContainer");

    if (!container) {
      console.warn("Time slots container not found");
      return;
    }

    // Check if slots already exist
    if (container.querySelector('.appointment-slot')) {
      initializeTimeSlots();
      return;
    }

    // Generate time slots from 9 AM to 5 PM
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }

    container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
      ${slots.map(time => `
        <div class="appointment-slot" data-time="${time}" 
             style="padding: 10px; text-align: center; border: 2px solid #e5e7eb; 
                    border-radius: 8px; cursor: pointer; transition: all 0.2s;
                    background: white;">
          ${time}
        </div>
      `).join('')}
    </div>
  `;

    initializeTimeSlots();

    // Add CSS for selected state
    if (!DOM.get('timeSlotStyles')) {
      const style = DOM.createElement('style');
      style.id = 'timeSlotStyles';
      style.textContent = `
      .appointment-slot:hover {
        background-color: #f3f4f6 !important;
        border-color: var(--primary) !important;
      }
      .appointment-slot.selected {
        background-color: var(--primary) !important;
        color: white !important;
        border-color: var(--primary) !important;
        font-weight: 600;
      }
    `;
      DOM.head.appendChild(style);
    }
  }
  const doctor = DOM.get("appointmentDoctor")?.value;
  const date = DOM.get("appointmentDateInput")?.value;
  generateTimeSlots(doctor, date);
}

/**
 * Clear appointment form
 */
function clearAppointmentForm() {
  clearSelectedPatient();

  const dateInput = new Date().toISOString().split('T')[0]
  DOM.setValue("appointmentDateInput", dateInput);
  DOM.setValue("appointmentDoctor", "");
  DOM.setValue("appointmentType", "");
  DOM.setValue("appointmentNotes", "");

  // Clear selected time slot
  document.querySelectorAll(".appointment-slot.selected").forEach(slot => {
    slot.classList.remove("selected");
  });
}

/**
 * Export appointments data to CSV
 */
function exportAppointmentsData() {
  const data = appointments.map(a => ({
    AppointmentID: a.id,
    Date: a.date,
    Time: a.time,
    PatientID: a.patientId,
    PatientName: a.patientName,
    Doctor: a.doctor,
    Type: a.type,
    Status: a.status,
    Notes: a.notes || ""
  }));

  exportToCSV(data, "appointments_report.csv");
  showNotification("Appointments data exported successfully");
}

// Initialize appointments when DOM is ready
if (typeof DOM !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    initializeAppointments();
  });
}
