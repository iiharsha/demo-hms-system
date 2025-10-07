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

  if (room.status === 'maintenance') {
    showNotification('Cannot assign patients to rooms under maintenance', 'error');
    return;
  }

  const availableBeds = room.occupiedBeds.filter(bed => !bed.patient);
  if (availableBeds.length === 0) {
    showNotification('No available beds in this room', 'error');
    return;
  }

  if (!patients?.length) {
    showNotification('No patients found in the system. Please add patients first.', 'error');
    return;
  }

  // Get patients not admitted
  const admittedIds = new Set();
  rooms.forEach(r => {
    r.occupiedBeds.forEach(bed => {
      if (bed.patientId) admittedIds.add(bed.patientId);
    });
  });

  const availablePatients = patients.filter(p => !admittedIds.has(p.id));
  if (availablePatients.length === 0) {
    showNotification('All patients are currently admitted.', 'warning');
    return;
  }

  // Update room header
  DOM.setHTML('assignRoomHeader', `<h4>Room ${room.id}</h4>`);

  // Populate patient dropdown
  DOM.setHTML(
    'patientSelect',
    `<option value="">Select Patient</option>` +
    availablePatients
      .map(
        p => `<option value="${p.id}">${p.name} (${p.id}) — ${p.age}y, ${p.gender}</option>`
      )
      .join('')
  );

  // Populate bed dropdown
  DOM.setHTML(
    'bedSelect',
    `<option value="">Select Bed</option>` +
    availableBeds.map(b => `<option value="${b.bed}">Bed ${b.bed}</option>`).join('')
  );

  // Set today's date
  DOM.get('admissionDate').value = new Date().toISOString().split('T')[0];

  // Update room info box
  DOM.setHTML(
    'roomInfoBox',
    `
    <div style="display: flex; gap: 10px;">
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
  `
  );

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

    const occupiedBeds = room.occupiedBeds.filter(bed => bed.patient);
    if (occupiedBeds.length === 0) {
      showNotification('No patients to discharge from this room', 'warning');
      return;
    }

    // Build the dropdown markup
    const selectHTML = `
      <select id="dischargePatientSelect" required onchange="updateDischargeDetails()" class="select-filter p-2 show w-full">
        <option value="">Select Patient</option>
        ${occupiedBeds.map(bed => `
          <option value="${bed.bed}" data-patient-id="${bed.patientId}" data-admission="${bed.admissionDate}">
            Bed ${bed.bed}: ${bed.patient} (${bed.patientId})
          </option>
        `).join('')}
      </select>
    `;

    // Inject it into container
    DOM.setHTML('dischargePatientSelectContainer', selectHTML);

    // Set default discharge date
    DOM.get('dischargeDate').value = new Date().toISOString().split('T')[0];

    openModal('dischargePatientModal');
  } catch (err) {
    console.error('Error in dischargeFromRoom(): ', err);
    showErrorNotification('Unexpected error occurred. Please try again!');
  }
}

/**
 * Update discharge details when patient is selected
 */
function updateDischargeDetails() {
  const select = DOM.get('dischargePatientSelect');
  const selectedOption = select.options[select.selectedIndex];

  if (!selectedOption.value) {
    DOM.get('patientDetailsSection').style.display = 'none';
    return;
  }

  const patientId = selectedOption.dataset.patientId;
  console.log(selectedOption.dataset.patientId);
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

    DOM.setHTML('patientDetailsContent', detailsHtml);
    DOM.get('patientDetailsSection').style.display = 'block';
  }
}

/**
 * Handle patient discharge form submission
 */
function handlePatientDischarge(event) {
  event.preventDefault();

  const roomId = currentRoomId;
  const bedId = DOM.getValue('dischargePatientSelect');
  const dischargeDate = DOM.getValue('dischargeDate');
  const dischargeReason = DOM.getValue('dischargeReason');
  const notes = DOM.getValue('dischargeNotes');

  const room = rooms.find(r => r.id === roomId);
  const bed = room?.occupiedBeds.find(b => b.bed === bedId);

  if (!room || !bed || !bed.patientId) {
    showWarningNotification('Invalid selection');
    return false;
  }

  const admission = admissions.find(a => a.patientId === bed.patientId && a.roomId === roomId && a.bed === bedId && a.status === "Active");

  if (!admission) {
    showWarningNotification("Admission not found");
    return false;
  }

  if (admission.status === "Discharged") {
    showWarningNotification("Patient already discharged");
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
  const searchValue = DOM.getValue('roomSearchInput').toLowerCase();
  const filteredRooms = rooms.filter(room => {
    return room.id.toLowerCase().includes(searchValue) ||
      room.floor.toString().includes(searchValue) ||
      formatRoomType(room.type).toLowerCase().includes(searchValue);
  });

  DOM.setHTML('roomManagementList', generateRoomManagementList(filteredRooms));
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
  DOM.setHTML('roomManagementList', generateRoomManagementList(roomList));

  // Clear search input
  const searchInput = DOM.get('roomSearchInput');
  if (searchInput) {
    searchInput.value = '';
  }

  // Open the modal
  openModal('roomManagementModal');
}
