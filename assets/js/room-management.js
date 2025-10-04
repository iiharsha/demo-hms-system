/*
#############################################
# Handle patient assignment and discharging #
# as well as updating status of rooms like  #
# changing room status -> maintenance .     #
#############################################
*/


/**
 * Open modal to assign a patient to a room
 */
function assignPatientToRoom() {

  if (!currentRoomId) {
    showNotification('Please select a room first', 'error');
    return;
  }

  const room = rooms.find(r => r.id === currentRoomId);
  if (!room) {
    showNotification('Room not found', 'error');
    return;
  }

  // Check if room is under maintenance
  if (room.status === 'maintenance') {
    showNotification('Cannot assign patients to rooms under maintenance', 'error');
    return;
  }

  // Get available beds in this room
  const availableBeds = room.occupiedBeds.filter(bed => !bed.patient);

  if (availableBeds.length === 0) {
    showNotification('No available beds in this room', 'error');
    return;
  }

  // Check if patients array exists
  if (typeof patients === 'undefined' || !patients || patients.length === 0) {
    showNotification('No patients found in the system. Please add patients first.', 'error');
    console.error('Patients array not found or empty:', patients);
    return;
  }

  // Get patients who are NOT currently admitted
  const admittedPatientIds = new Set();
  rooms.forEach(r => {
    r.occupiedBeds.forEach(bed => {
      if (bed.patient && bed.patientId) {
        admittedPatientIds.add(bed.patientId);
      }
    });
  });

  console.log('Total patients:', patients.length);
  console.log('Admitted patient IDs:', Array.from(admittedPatientIds));

  const availablePatients = patients.filter(p => !admittedPatientIds.has(p.id));

  console.log('Available patients for admission:', availablePatients.length, availablePatients);

  if (availablePatients.length === 0) {
    showNotification('All patients are currently admitted. No patients available for new admission.', 'warning');
    return;
  }

  // Build the assignment form
  const html = `
    <div style="margin-bottom: 20px;">
      <h4 style="margin-bottom: 10px;">Room ${room.id}</h4>
    </div>

    <form id="assignPatientForm" onsubmit="handlePatientAssignment(event); return false;">
      <div style="margin-bottom: 20px;">
        <select id="patientSelect" required class="select-filter">
          <option value=""> Select Patient </option>
          ${availablePatients.map(p => `
            <option value="${p.id}">
              ${p.name} (${p.id}) - Age: ${p.age}, ${p.gender}
            </option>
          `).join('')}
        </select>
      </div>

      <div style="margin-bottom: 20px;">
        <select id="bedSelect" required class="select-filter">
          <option value=""> Select Bed </option>
          ${availableBeds.map(bed => `
            <option value="${bed.bed}">Bed ${bed.bed}</option>
          `).join('')}
        </select>
      </div>

      <div style="margin-bottom: 20px;">
        <label 
        style="display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: var(--dark);"
        >
        Admission Date *
        </label>
        <input type="date" id="admissionDate" required value="${new Date().toISOString().split('T')[0]}" 
               style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
      </div>

      <div style="margin-bottom: 20px;">
        <label 
        style="display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: var(--dark);"
        >
        Admission Notes
        </label>
        <textarea id="admissionNotes" rows="3" placeholder="Enter any admission notes or special instructions..."
                  style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
      </div>

      <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary);">
        <div style="display: flex; gap: 10px; margin-bottom: 8px;">
          <i class="ri-information-line" style="color: var(--primary); font-size: 20px;"></i>
          <div>
            <strong style="color: var(--primary);">Room Details</strong>
            <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">
              <div>Type: ${formatRoomType(room.type)}</div>
              <div>Daily Rate: ₹${room.rate}</div>
              <div>Floor: ${room.floor}</div>
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button type="button" class="btn btn-outline" onclick="closeAssignmentModal()" style="flex: 1;">Cancel</button>
        <button type="submit" class="btn btn-primary" style="flex: 1;">Assign Patient</button>
      </div>
    </form>
  `;

  document.getElementById('assignModalBody').innerHTML = html;
  openModal('assignPatientModal');
}

/**
 * Handle patient assignment form submission
 */
function handlePatientAssignment(event) {
  event.preventDefault();

  const roomId = currentRoomId;
  const patientId = document.getElementById('patientSelect').value;
  const bedId = document.getElementById('bedSelect').value;
  const admissionDate = document.getElementById('admissionDate').value;
  const notes = document.getElementById('admissionNotes').value;

  const room = rooms.find(r => r.id === roomId);
  const patient = patients.find(p => p.id === patientId);
  const bed = room.occupiedBeds.find(b => b.bed === bedId);

  if (!room || !patient || !bed) {
    showNotification('Invalid selection', 'error');
    return false;
  }

  // Assign patient to bed
  bed.patient = patient.name;
  bed.patientId = patient.id;
  bed.admissionDate = admissionDate;
  bed.admissionNotes = notes;

  // Update room status
  const occupiedCount = room.occupiedBeds.filter(b => b.patient).length;
  if (occupiedCount === room.totalBeds) {
    room.status = 'occupied';
  } else {
    room.status = 'available';
  }

  // Close modals and refresh
  closeAssignmentModal();
  closeModal('roomDetailsModal');

  showNotification(`${patient.name} assigned to Room ${roomId}, Bed ${bedId}`, 'success');

  // Reload the rooms view
  if (typeof loadRooms === 'function') {
    loadRooms();
  } else {
    renderRoomGrid();
    if (typeof loadRoomTable === 'function') {
      loadRoomTable();
    }
  }

  return false;
}

/**
 * Close assignment modal
 */
function closeAssignmentModal() {
  closeModal('assignPatientModal');
}

/**
 * Open modal to discharge a patient from a room
 */
function dischargeFromRoom() {
  try {
    if (!currentRoomId) {
      showNotification('Please select a room first', 'error');
      return;
    }

    const room = rooms.find(r => r.id === currentRoomId);
    if (!room) {
      showNotification('Room not found', 'error');
      return;
    }

    // Get occupied beds in this room
    const occupiedBeds = room.occupiedBeds.filter(bed => bed.patient);

    if (occupiedBeds.length === 0) {
      showNotification('No patients to discharge from this room', 'warning');
      return;
    }

    // Build the discharge form
    const html = `
<div class="mb3">
  <h4 class="mb2">Room ${room.id}</h4>
</div>

<form id="dischargePatientForm" onsubmit="handlePatientDischarge(event); return false;">
  <div class="mb3">
    <select id="dischargePatientSelect" required onchange="updateDischargeDetails()" class="select-filter pa2 db w-100 ba b--light-gray br2">
      <option value="">Select Patient</option>
      ${occupiedBeds.map(bed => `
        <option value="${bed.bed}" data-patient-id="${bed.patientId}" data-admission="${bed.admissionDate}">
          Bed ${bed.bed}: ${bed.patient} (${bed.patientId})
        </option>
      `).join('')}
    </select>
  </div>

  <div id="patientDetailsSection" class="mb3 bg-near-white pa3 br2" style="display: none;">
    <h5 class="mb2 f6">Patient Details</h5>
    <div id="patientDetailsContent" class="f6 gray"></div>
  </div>

  <div class="mb3">
    <label for="dischargeDate" class="i mb2 db f6">Discharge Date *</label>
    <input type="date" id="dischargeDate" required value="${new Date().toISOString().split('T')[0]}" 
           class="pa2 db w-100 ba b--light-gray br2 f6">
  </div>

  <div class="mb3">
    <select id="dischargeReason" required class="select-filter pa2 db w-100 ba b--light-gray br2">
      <option value="">Select Reason</option>
      <option value="recovered">Recovered</option>
      <option value="transferred">Transferred to Another Facility</option>
      <option value="home_care">Home Care</option>
      <option value="ama">Against Medical Advice (AMA)</option>
      <option value="deceased">Deceased</option>
      <option value="other">Other</option>
    </select>
  </div>

  <div class="mb3">
    <label for="dischargeNotes" class="i mb2 db f6">Discharge Summary / Notes</label>
    <textarea id="dischargeNotes" rows="4" placeholder="Enter discharge summary, follow-up instructions, prescriptions, etc..."
              class="pa2 db w-100 ba b--light-gray br2 f6 resize-vertical"></textarea>
  </div>

  <div
    style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid var(--warning); margin-bottom: 20px;">
    <div style="display: flex; gap: 10px;"> <i class="ri-alert-line" style="color: var(--warning); font-size: 20px;"></i>
      <div> <strong style="color: var(--warning);">Important</strong>
        <p style="font-size: 14px; color: #92400e; margin-top: 5px; margin-bottom: 0;"> This will mark the bed as
          available and remove the patient from the room. Make sure all billing and documentation is complete before
          discharge. </p>
      </div>
    </div>
  </div>

  <div class="flex gap2 mt3">
    <button type="button" class="btn btn-outline flex-auto pa2" onclick="closeDischargeModal()">Cancel</button>
    <button type="submit" class="btn btn-primary flex-auto pa2">Discharge Patient</button>
  </div>
</form>
`;

    document.getElementById('dischargeModalBody').innerHTML = html;
    openModal('dischargePatientModal');
  } catch (err) {
    console.error('Error in dischargeFromRoom(): ', err)
    showErrorNotification('Unexpected error occured. Please Try Again!');
  }
}

/**
 * Update discharge details when patient is selected
 */
function updateDischargeDetails() {
  const select = document.getElementById('dischargePatientSelect');
  const selectedOption = select.options[select.selectedIndex];

  if (!selectedOption.value) {
    document.getElementById('patientDetailsSection').style.display = 'none';
    return;
  }

  const patientId = selectedOption.dataset.patientId;
  const admissionDate = selectedOption.dataset.admission;
  const patient = patients.find(p => p.id === patientId);

  if (patient) {
    const daysSinceAdmission = Math.floor((new Date() - new Date(admissionDate)) / (1000 * 60 * 60 * 24));

    const detailsHtml = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <strong>Patient Name:</strong><br>${patient.name}
        </div>
        <div>
          <strong>Patient ID:</strong><br>${patient.id}
        </div>
        <div>
          <strong>Age / Gender:</strong><br>${patient.age} years, ${patient.gender}
        </div>
        <div>
          <strong>Blood Group:</strong><br>${patient.bloodGroup}
        </div>
        <div>
          <strong>Admission Date:</strong><br>${admissionDate}
        </div>
        <div>
          <strong>Days Admitted:</strong><br>${daysSinceAdmission} days
        </div>
      </div>
    `;

    document.getElementById('patientDetailsContent').innerHTML = detailsHtml;
    document.getElementById('patientDetailsSection').style.display = 'block';
  }
}

/**
 * Handle patient discharge form submission
 */
function handlePatientDischarge(event) {
  event.preventDefault();

  const roomId = currentRoomId;
  const bedId = document.getElementById('dischargePatientSelect').value;
  const dischargeDate = document.getElementById('dischargeDate').value;
  const dischargeReason = document.getElementById('dischargeReason').value;
  const notes = document.getElementById('dischargeNotes').value;

  const room = rooms.find(r => r.id === roomId);
  const bed = room?.occupiedBeds.find(b => b.bed === bedId);

  if (!room || !bed || !bed.patientId) {
    showNotification('Invalid selection', 'error');
    return false;
  }

  const admission = admissions.find(a => a.patientId === bed.patientId && a.roomId === roomId && a.bed === bedId && a.status === "Active");

  if (!admission) {
    showNotification("Admission not found", "error");
    return false;
  }

  if (admission.status === "Discharged") {
    showNotification("Patient already discharged", "error");
    return false;
  }

  // Update admission status
  admission.status = "Discharged";
  admission.dischargeDate = dischargeDate;

  // Add discharge entry to patient medical history
  const patient = patients.find(p => p.id === admission.patientId);
  if (patient && patient.medicalHistory) {
    patient.medicalHistory.unshift({
      date: dischargeDate,
      type: "Discharge",
      doctor: admission.doctorName,
      diagnosis: admission.reason || dischargeReason,
      notes: notes || `Discharged from Room ${admission.roomId}, Bed ${admission.bed}`
    });
  }

  // Clear the bed
  bed.patient = null;
  bed.patientId = null;
  bed.admissionDate = null;
  bed.admissionNotes = null;

  // Update room status
  const occupiedCount = room.occupiedBeds.filter(b => b.patient).length;
  room.status = occupiedCount === 0 ? 'available' : 'available';

  // Close modals
  closeDischargeModal();
  closeModal('roomDetailsModal');

  // Refresh displays
  loadAdmissions();
  if (typeof loadRooms === 'function') {
    loadRooms();
  } else {
    renderRoomGrid();
    if (typeof loadRoomTable === 'function') loadRoomTable();
  }
  if (typeof initializeDashboard === 'function') initializeDashboard();

  showNotification(`${patient?.name || bed.patient} discharged successfully`, 'success');

  return false;
}

/**
 * Close discharge modal
 */
function closeDischargeModal() {
  closeModal('dischargePatientModal');
}


/**
 * Generate the room management list HTML
 * @param {Array<Object>} roomList - List of rooms to display
 * @returns {string} HTML string for room management list
 */
function generateRoomManagementList(roomList) {
  if (!roomList || roomList.length === 0) {
    return `
      <div class="no-results">
        <i class="ri-alert-line"></i>
        <p>No rooms found</p>
      </div>
    `;
  }

  return roomList.map(room => {
    const occupiedCount = room.occupiedBeds.filter(b => b.patient).length;
    const availableCount = room.totalBeds - occupiedCount;

    let statusBadge = '';
    let statusAttr = '';

    if (room.status === 'maintenance') {
      statusBadge = '<span class="badge badge-danger">Maintenance</span>';
      statusAttr = 'maintenance';
    } else if (room.status === 'reserved') {
      statusBadge = '<span class="badge badge-primary">Reserved</span>';
      statusAttr = 'reserved';
    } else if (occupiedCount === room.totalBeds) {
      statusBadge = '<span class="badge badge-warning">Full</span>';
      statusAttr = 'occupied';
    } else if (occupiedCount > 0) {
      statusBadge = '<span class="badge badge-warning">Partial</span>';
      statusAttr = 'occupied';
    } else {
      statusBadge = '<span class="badge badge-success">Available</span>';
      statusAttr = 'available';
    }

    return `
      <div class="room-management-item" data-status="${statusAttr}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <h4>${room.id}</h4>
              ${statusBadge}
            </div>
            <div class="room-info">
              <div><strong>Type:</strong> ${formatRoomType(room.type)}</div>
              <div><strong>Floor:</strong> ${room.floor}</div>
              <div><strong>Beds:</strong> ${occupiedCount}/${room.totalBeds} occupied</div>
              <div><strong>Rate:</strong> ₹${room.rate}/day</div>
            </div>
          </div>
          <div class="room-actions">
            ${room.status === 'maintenance'
        ? `<button class="btn btn-success" onclick="setRoomAvailable('${room.id}')">
                   <i class="ri-check-line"></i> Mark Available
                 </button>`
        : `<button class="btn btn-warning" onclick="setRoomMaintenance('${room.id}')">
                   <i class="ri-tools-line"></i> Maintenance
                 </button>`
      }
            ${room.status === 'reserved'
        ? `<button class="btn btn-outline" onclick="cancelRoomReservation('${room.id}')">
                   <i class="ri-close-line"></i> Cancel Reserve
                 </button>`
        : (occupiedCount === 0 && room.status !== 'maintenance')
          ? `<button class="btn btn-primary" onclick="reserveRoom('${room.id}')">
                     <i class="ri-bookmark-line"></i> Reserve
                   </button>`
          : ''
      }
          </div>
          <div class="room-actions">
            <button class="btn btn-primary" onclick="viewRoomDetails('${room.id}')">
              Manage Patients
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Filter room management list based on search input
 * @returns {void}
 */
function filterRoomManagementList() {
  const searchValue = document.getElementById('roomSearchInput').value.toLowerCase();
  const filteredRooms = rooms.filter(room => {
    return room.id.toLowerCase().includes(searchValue) ||
      room.floor.toString().includes(searchValue) ||
      formatRoomType(room.type).toLowerCase().includes(searchValue);
  });

  document.getElementById('roomManagementList').innerHTML = generateRoomManagementList(filteredRooms);
}

/**
 * Set room status to maintenance
 * @param {string} roomId - The room ID
 * @returns {void}
 */
function setRoomMaintenance(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    showNotification('Room not found', 'error');
    return;
  }

  // Check if room has occupied beds
  const occupiedCount = room.occupiedBeds.filter(b => b.patient).length;
  if (occupiedCount > 0) {
    const patientNames = room.occupiedBeds
      .filter(b => b.patient)
      .map(b => b.patient)
      .join(', ');

    if (!confirm(`This room has ${occupiedCount} patient(s) (${patientNames}). Are you sure you want to mark it under maintenance? Consider discharging or transferring patients first.`)) {
      return;
    }
  }

  room.status = 'maintenance';
  showNotification(`Room ${roomId} marked as under maintenance`, 'success');

  // Refresh the management list
  filterRoomManagementList();

  // Refresh main room view if loadRooms exists
  if (typeof loadRooms === 'function') {
    loadRooms();
  }
}

/**
 * Set room status to available
 * @param {string} roomId - The room ID
 * @returns {void}
 */
function setRoomAvailable(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    showNotification('Room not found', 'error');
    return;
  }

  const occupiedCount = room.occupiedBeds.filter(b => b.patient).length;

  // Determine appropriate status
  if (occupiedCount === room.totalBeds) {
    room.status = 'occupied';
  } else {
    room.status = 'available';
  }

  showNotification(`Room ${roomId} marked as available`, 'success');

  // Refresh the management list
  filterRoomManagementList();

  // Refresh main room view if loadRooms exists
  if (typeof loadRooms === 'function') {
    loadRooms();
  }
}

/**
 * Reserve a room
 * @param {string} roomId - The room ID
 * @returns {void}
 */
function reserveRoom(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    showNotification('Room not found', 'error');
    return;
  }

  // Check if room is empty
  const occupiedCount = room.occupiedBeds.filter(b => b.patient).length;
  if (occupiedCount > 0) {
    showNotification('Cannot reserve a room with occupied beds', 'error');
    return;
  }

  if (room.status === 'maintenance') {
    showNotification('Cannot reserve a room under maintenance', 'error');
    return;
  }

  room.status = 'reserved';
  showNotification(`Room ${roomId} has been reserved`, 'success');

  // Refresh the management list
  filterRoomManagementList();

  // Refresh main room view if loadRooms exists
  if (typeof loadRooms === 'function') {
    loadRooms();
  }
}

/**
 * Cancel room reservation
 * @param {string} roomId - The room ID
 * @returns {void}
 */
function cancelRoomReservation(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    showNotification('Room not found', 'error');
    return;
  }

  room.status = 'available';
  showNotification(`Reservation cancelled for room ${roomId}`, 'success');

  // Refresh the management list
  filterRoomManagementList();

  // Refresh main room view if loadRooms exists
  if (typeof loadRooms === 'function') {
    loadRooms();
  }
}

/**
 * Open the room management modal to allocate and deallocate rooms.
 *
 * @param {Array<Object>} [roomList=rooms] - Optional list of rooms to render (defaults to global rooms).
 * @returns {void}
 */
function openRoomManagementModal(roomList = rooms) {
  // Populate the modal content
  document.getElementById('roomManagementList').innerHTML = generateRoomManagementList(roomList);

  // Clear search input
  const searchInput = document.getElementById('roomSearchInput');
  if (searchInput) {
    searchInput.value = '';
  }

  // Open the modal
  openModal('roomManagementModal');
}
