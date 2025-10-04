/* admissions page */

/**
 * @typedef {Object} Admission
 * @property {string} id - Admission ID
 * @property {string} patientId - Patient ID reference
 * @property {string} patientName - Patient name
 * @property {string} roomId - Room ID
 * @property {string} bed - The bed identifier in the room
 * @property {string} admissionDate - Admission Date (YYYY-MM-DD)
 * @property {string} doctorName - Admitting doctor name
 * @property {"Active"|"Discharged"} status - Admission status
 * @property {string} [reason] - Reason for admission
 * @property {string} [dischargeDate] - Discharge date if applicable
 */

/**
 * List of all admissions
 * @type {Admission[]}
 */
const admissions = [];

/**
 * Initialize admissions from existing room occupancy data
 * This syncs the admissions array with currently occupied beds in rooms
 */
function initializeAdmissions() {
  admissions.length = 0; // Clear existing admissions

  let admissionCounter = 1;

  rooms.forEach(room => {
    room.occupiedBeds.forEach(bed => {
      if (bed.patient && bed.patientId) {
        const patient = patients.find(p => p.id === bed.patientId);

        // Find the most recent medical history entry for this patient
        const recentHistory = patient?.medicalHistory?.[0];

        admissions.push({
          id: `ADM${String(admissionCounter++).padStart(3, '0')}`,
          patientId: bed.patientId,
          patientName: bed.patient,
          roomId: room.id,
          bed: bed.bed,
          admissionDate: bed.admissionDate,
          doctorName: recentHistory?.doctor || "Not Assigned",
          status: "Active",
          reason: recentHistory?.diagnosis || "General Admission"
        });
      }
    });
  });
}

/**
 * Load and display admissions in the table
 */
function loadAdmissions() {
  // Ensure admissions are initialized
  if (admissions.length === 0) {
    initializeAdmissions();
  }

  updateAdmissionStats();
  renderAdmissionsTable(admissions);
}

/**
 * Update admission statistics on the page
 */
function updateAdmissionStats() {
  const activeAdmissions = admissions.filter(a => a.status === "Active").length;
  const dischargedToday = admissions.filter(a =>
    a.status === "Discharged" &&
    a.dischargeDate === new Date().toISOString().split('T')[0]
  ).length;

  // Update stat cards if they exist
  const totalAdmissionsEl = document.getElementById("totalAdmissions");
  const activeAdmissionsEl = document.getElementById("activeAdmissions");
  const dischargedTodayEl = document.getElementById("dischargedToday");

  if (totalAdmissionsEl) totalAdmissionsEl.textContent = admissions.length;
  if (activeAdmissionsEl) activeAdmissionsEl.textContent = activeAdmissions;
  if (dischargedTodayEl) dischargedTodayEl.textContent = dischargedToday;
}

/**
 * Render the admissions table, sorted by most recent admission date.
 * @param {Admission[]} admissionsList - List of admissions to display
 */
function renderAdmissionsTable(admissionsList) {
  const table = document.getElementById("admissionsTable");

  if (!table) {
    console.error("Admissions table element not found");
    return;
  }

  if (!Array.isArray(admissionsList) || admissionsList.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: #6b7280; padding: 20px;">
          No admissions found
        </td>
      </tr>
    `;
    return;
  }

  // 🧠 Sort by date (newest first)
  const sortedAdmissions = [...admissionsList].sort((a, b) => {
    const dateA = new Date(a.admissionDate);
    const dateB = new Date(b.admissionDate);
    return dateB - dateA; // descending (most recent first)
  });

  table.innerHTML = sortedAdmissions.map(adm => {
    const statusClass = adm.status === "Active" ? "success" : "warning";
    const statusText = adm.status;

    return `
      <tr>
        <td>${adm.id}</td>
        <td>${adm.patientName}</td>
        <td>${adm.roomId}</td>
        <td>${adm.bed}</td>
        <td>${adm.admissionDate}</td>
        <td>${adm.doctorName}</td>
        <td><span class="badge badge-${statusClass}">${statusText}</span></td>
        <td>
          <button class="btn btn-primary" onclick="viewAdmission('${adm.id}')" 
                  style="padding: 6px 12px; font-size: 12px;">View</button>
          ${adm.status === "Active" ? `
            <button class="btn btn-outline" onclick="dischargePatient('${adm.id}')" 
                    style="padding: 6px 12px; font-size: 12px;">Discharge</button>
          ` : ''}
        </td>
      </tr>
    `;
  }).join("");
}

/**
 * Filter admissions by status
 */
function filterAdmissions() {
  const statusFilter = document.getElementById("admissionStatusFilter")?.value;

  let filtered = admissions;

  if (statusFilter) {
    filtered = admissions.filter(a =>
      a.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  renderAdmissionsTable(filtered);
}

/**
 * View admission details in a modal
 * @param {string} admissionId - The admission ID to view
 */
function viewAdmission(admissionId) {
  const admission = admissions.find(a => a.id === admissionId);

  if (!admission) {
    showNotification("Admission not found", "error");
    return;
  }

  const patient = patients.find(p => p.id === admission.patientId);
  const room = rooms.find(r => r.id === admission.roomId);

  const modalBody = document.getElementById("viewAppointmentModalBody");

  if (!modalBody) {
    console.error("Modal body element not found");
    return;
  }

  modalBody.innerHTML = `
    <div style="display: grid; gap: 20px;">
      <div class="card">
        <h4 style="margin-bottom: 15px;">Admission Information</h4>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px;"><strong>Admission ID:</strong></td>
            <td style="padding: 8px;">${admission.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Status:</strong></td>
            <td style="padding: 8px;">
              <span class="badge badge-${admission.status === "Active" ? "success" : "warning"}">
                ${admission.status}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Admission Date:</strong></td>
            <td style="padding: 8px;">${admission.admissionDate}</td>
          </tr>
          ${admission.dischargeDate ? `
          <tr>
            <td style="padding: 8px;"><strong>Discharge Date:</strong></td>
            <td style="padding: 8px;">${admission.dischargeDate}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px;"><strong>Reason:</strong></td>
            <td style="padding: 8px;">${admission.reason || "N/A"}</td>
          </tr>
        </table>
      </div>
      
      <div class="card">
        <h4 style="margin-bottom: 15px;">Patient Information</h4>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px;"><strong>Patient Name:</strong></td>
            <td style="padding: 8px;">${admission.patientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Patient ID:</strong></td>
            <td style="padding: 8px;">${admission.patientId}</td>
          </tr>
          ${patient ? `
          <tr>
            <td style="padding: 8px;"><strong>Age:</strong></td>
            <td style="padding: 8px;">${patient.age} years</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Blood Group:</strong></td>
            <td style="padding: 8px;">${patient.bloodGroup || "Unknown"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Phone:</strong></td>
            <td style="padding: 8px;">${patient.phone}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      
      <div class="card">
        <h4 style="margin-bottom: 15px;">Room & Doctor Information</h4>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px;"><strong>Room Number:</strong></td>
            <td style="padding: 8px;">${admission.roomId}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Bed:</strong></td>
            <td style="padding: 8px;">${admission.bed}</td>
          </tr>
          ${room ? `
          <tr>
            <td style="padding: 8px;"><strong>Room Type:</strong></td>
            <td style="padding: 8px;">${formatRoomType(room.type)}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Daily Rate:</strong></td>
            <td style="padding: 8px;">₹${room.rate}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px;"><strong>Admitting Doctor:</strong></td>
            <td style="padding: 8px;">${admission.doctorName}</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  openModal("viewAppointmentModal");
}

/**
 * Open the new admission modal and populate patient and room dropdowns
 */
function openNewAdmissionModal() {
  populateAdmissionPatientDropdown();
  populateAdmissionRoomDropdown();
  openModal("newAdmissionModal");
}

/**
 * Populate the patient dropdown with non-admitted patients
 */
function populateAdmissionPatientDropdown() {
  const patientSelect = document.getElementById("admissionPatient");

  if (!patientSelect) {
    console.error("Patient select element not found");
    return;
  }

  // Get list of currently admitted patient IDs
  const admittedPatientIds = admissions
    .filter(a => a.status === "Active")
    .map(a => a.patientId);

  // Filter out already admitted patients
  const availablePatients = patients.filter(p =>
    !admittedPatientIds.includes(p.id)
  );

  if (availablePatients.length === 0) {
    patientSelect.innerHTML = '<option value="">No patients available for admission</option>';
    return;
  }

  patientSelect.innerHTML = `
    <option value="">Select Patient</option>
    ${availablePatients.map(p => `
      <option value="${p.id}">${p.name} (${p.id}) - ${p.age}y, ${p.gender}</option>
    `).join('')}
  `;
}

/**
 * Populate the room dropdown with available rooms/beds
 */
function populateAdmissionRoomDropdown() {
  const roomSelect = document.getElementById("roomNumber");

  if (!roomSelect) {
    console.error("Room select element not found");
    return;
  }

  // Find rooms with available beds
  const availableRooms = rooms.filter(room =>
    room.status !== "maintenance" &&
    room.occupiedBeds.some(bed => bed.patient === null)
  );

  if (availableRooms.length === 0) {
    roomSelect.innerHTML = '<option value="">No rooms available</option>';
    return;
  }

  roomSelect.innerHTML = `
    <option value="">Select Room</option>
    ${availableRooms.map(room => {
    const availableBeds = room.occupiedBeds.filter(b => !b.patient).length;
    return `
        <option value="${room.id}">
          ${room.id} - ${formatRoomType(room.type)} (${availableBeds} bed${availableBeds > 1 ? 's' : ''} available)
        </option>
      `;
  }).join('')}
  `;

  // Add change event listener to populate beds
  roomSelect.addEventListener('change', populateAdmissionBedDropdown);
}

/**
 * Populate the bed dropdown based on selected room
 */
function populateAdmissionBedDropdown() {
  const roomSelect = document.getElementById("roomNumber");
  const bedSelect = document.getElementById("bedNumber");

  if (!roomSelect || !bedSelect) {
    console.error("Room or bed select element not found");
    return;
  }

  const selectedRoomId = roomSelect.value;

  if (!selectedRoomId) {
    bedSelect.innerHTML = '<option value="">Select a room first</option>';
    return;
  }

  const room = rooms.find(r => r.id === selectedRoomId);

  if (!room) {
    bedSelect.innerHTML = '<option value="">Room not found</option>';
    return;
  }

  const availableBeds = room.occupiedBeds.filter(bed => bed.patient === null);

  if (availableBeds.length === 0) {
    bedSelect.innerHTML = '<option value="">No beds available</option>';
    return;
  }

  bedSelect.innerHTML = `
    <option value="">Select Bed</option>
    ${availableBeds.map(bed => `
      <option value="${bed.bed}">Bed ${bed.bed}</option>
    `).join('')}
  `;
}

/**
 * Save a new admission
 */
function saveAdmission() {
  const patientId = document.getElementById("admissionPatient")?.value;
  const roomId = document.getElementById("roomNumber")?.value;
  const bedId = document.getElementById("bedNumber")?.value;
  const doctorName = document.getElementById("admittingDoctor")?.value;
  const reason = document.getElementById("admissionReason")?.value;

  // Validation
  if (!patientId) {
    showNotification("Please select a patient", "error");
    return;
  }

  if (!roomId) {
    showNotification("Please select a room", "error");
    return;
  }

  if (!bedId) {
    showNotification("Please select a bed", "error");
    return;
  }

  if (!doctorName) {
    showNotification("Please enter the admitting doctor's name", "error");
    return;
  }

  // Get patient details
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    showNotification("Patient not found", "error");
    return;
  }

  // Get room and update bed occupancy
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    showNotification("Room not found", "error");
    return;
  }

  const bed = room.occupiedBeds.find(b => b.bed === bedId);
  if (!bed) {
    showNotification("Bed not found", "error");
    return;
  }

  if (bed.patient) {
    showNotification("Bed is already occupied", "error");
    return;
  }

  // Create admission record
  const admissionDate = new Date().toISOString().split('T')[0];
  const admissionId = `ADM${String(admissions.length + 1).padStart(3, '0')}`;

  const newAdmission = {
    id: admissionId,
    patientId: patient.id,
    patientName: patient.name,
    roomId: room.id,
    bed: bedId,
    admissionDate: admissionDate,
    doctorName: doctorName,
    status: "Active",
    reason: reason || "General Admission"
  };

  // Update bed occupancy in room
  bed.patient = patient.name;
  bed.patientId = patient.id;
  bed.admissionDate = admissionDate;

  // Update room status if all beds are now occupied
  const occupiedCount = room.occupiedBeds.filter(b => b.patient).length;
  if (occupiedCount === room.totalBeds) {
    room.status = "occupied";
  }

  // Add to admissions array
  admissions.push(newAdmission);

  // Add medical history entry to patient
  if (patient.medicalHistory) {
    patient.medicalHistory.unshift({
      date: admissionDate,
      type: "Admission",
      doctor: doctorName,
      diagnosis: reason || "General Admission",
      notes: `Admitted to Room ${roomId}, Bed ${bedId}`
    });
  }

  // Refresh displays
  loadAdmissions();

  // Refresh rooms display if on rooms page
  if (typeof loadRooms === 'function') {
    loadRooms();
  }

  // Refresh dashboard if available
  if (typeof initializeDashboard === 'function') {
    initializeDashboard();
  }

  showNotification(`${patient.name} admitted successfully to Room ${roomId}, Bed ${bedId}`);

  // Clear form
  document.getElementById("admissionPatient").value = "";
  document.getElementById("roomNumber").value = "";
  document.getElementById("bedNumber").innerHTML = '<option value="">Select a room first</option>';
  document.getElementById("admittingDoctor").value = "";
  if (document.getElementById("admissionReason")) {
    document.getElementById("admissionReason").value = "";
  }
  closeModal("newAdmissionModal");
}

/**
 * Navigate to rooms page and open discharge modal for the given admission
 * @param {string} admissionId
 */
function dischargePatient(admissionId) {
  try {
    const admission = admissions.find(a => a.id === admissionId);
    if (!admission) {
      showErrorNotification("Admission not found", "error");
      return;
    }

    currentRoomId = admission.roomId;

    // Navigate to the Rooms page if possible
    if (typeof showPage === 'function') {
      showPage('rooms.html');

      // Wait for the rooms page DOM to load
      setTimeout(() => {
        try {
          if (typeof dischargeFromRoom === 'function') {
            dischargeFromRoom();

            const selectEl = document.getElementById('dischargePatientSelect');
            if (selectEl) {
              selectEl.value = admission.bed;
            } else {
              console.warn("Discharge patient select element not found");
            }
          } else {
            console.warn("dischargeFromRoom() not defined");
            openModal("dischargePatientModal");
          }
        } catch (err) {
          console.error("Error while opening discharge modal:", err);
          showErrorNotification("Unexpected error while opening discharge modal", "error");
        }
      }, 400);
    } else {
      dischargeFromRoom();
    }

  } catch (err) {
    console.error("Error in dischargePatient():", err);
    showErrorNotification("Unexpected error while discharging patient", "error");
  }
}

// /**
//  * Discharge a patient
//  * @param {string} admissionId - The admission ID to discharge
//  */
// function dischargePatientss(admissionId) {
//   const admission = admissions.find(a => a.id === admissionId);
//
//   if (!admission) {
//     showNotification("Admission not found", "error");
//     return;
//   }
//
//   if (admission.status === "Discharged") {
//     showNotification("Patient already discharged", "error");
//     return;
//   }
//
//   const dischargeDate = new Date().toISOString().split('T')[0];
//
//   // Update admission status
//   admission.status = "Discharged";
//   admission.dischargeDate = dischargeDate;
//
//   // Add discharge entry to patient medical history
//   const patient = patients.find(p => p.id === admission.patientId);
//   if (patient && patient.medicalHistory) {
//     patient.medicalHistory.unshift({
//       date: dischargeDate,
//       type: "Discharge",
//       doctor: admission.doctorName,
//       diagnosis: admission.reason,
//       notes: `Discharged from Room ${admission.roomId}, Bed ${admission.bed}`
//     });
//   }
//
//   // Refresh displays
//   loadAdmissions();
//
//   if (typeof loadRooms === 'function') {
//     loadRooms();
//   }
//
//   if (typeof initializeDashboard === 'function') {
//     initializeDashboard();
//   }
//
//   showNotification(`${admission.patientName} discharged successfully`);
// }

/**
 * Export admissions data to CSV
 */
function exportAdmissionsData() {
  const data = admissions.map(a => ({
    AdmissionID: a.id,
    PatientID: a.patientId,
    PatientName: a.patientName,
    Room: a.roomId,
    Bed: a.bed,
    AdmissionDate: a.admissionDate,
    DischargeDate: a.dischargeDate || "N/A",
    Doctor: a.doctorName,
    Reason: a.reason || "N/A",
    Status: a.status
  }));

  exportToCSV(data, "admissions_report.csv");
  showNotification("Admissions data exported successfully");
}

// Initialize admissions when the page loads
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    initializeAdmissions();
  });
}
