/**
 * Generate the room management list HTML
 * @param {Array<Object>} roomList - List of rooms to display
 * @returns {string} HTML string for room management list
 */
function generateRoomManagementList(roomList) {
  if (!roomList || roomList.length === 0) {
    return '<div class="no-results"><i class="ri-alert-line"></i>No rooms found</div>';
  }

  return roomList.map(room => {
    const occupiedCount = room.occupiedBeds.filter(b => b.patient).length;
    const availableCount = room.totalBeds - occupiedCount;

    let statusBadge = '';
    let statusColor = '';
    if (room.status === 'maintenance') {
      statusBadge = '<span class="badge badge-danger">Maintenance</span>';
      statusColor = 'var(--danger)';
    } else if (room.status === 'reserved') {
      statusBadge = '<span class="badge badge-primary">Reserved</span>';
      statusColor = 'var(--primary)';
    } else if (occupiedCount === room.totalBeds) {
      statusBadge = '<span class="badge badge-warning">Full</span>';
      statusColor = 'var(--warning)';
    } else if (occupiedCount > 0) {
      statusBadge = '<span class="badge badge-warning">Partial</span>';
      statusColor = 'var(--warning)';
    } else {
      statusBadge = '<span class="badge badge-success">Available</span>';
      statusColor = 'var(--success)';
    }

    return `
      <div class="room-management-item" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 12px; background: white;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <h4 style="margin: 0; font-size: 18px; font-weight: 600;">${room.id}</h4>
              ${statusBadge}
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; color: #6b7280; font-size: 14px;">
              <div><strong>Type:</strong> ${formatRoomType(room.type)}</div>
              <div><strong>Floor:</strong> ${room.floor}</div>
              <div><strong>Beds:</strong> ${occupiedCount}/${room.totalBeds} occupied</div>
              <div><strong>Rate:</strong> ₹${room.rate}/day</div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-shrink: 0;">
            ${room.status === 'maintenance'
        ? `<button class="btn btn-success" onclick="setRoomAvailable('${room.id}')" style="padding: 8px 16px; font-size: 13px;">
                   <i class="ri-check-line"></i> Mark Available
                 </button>`
        : `<button class="btn btn-warning" onclick="setRoomMaintenance('${room.id}')" style="padding: 8px 16px; font-size: 13px;">
                   <i class="ri-tools-line"></i> Maintenance
                 </button>`
      }
            ${room.status === 'reserved'
        ? `<button class="btn btn-outline" onclick="cancelRoomReservation('${room.id}')" style="padding: 8px 16px; font-size: 13px;">
                   <i class="ri-close-line"></i> Cancel Reserve
                 </button>`
        : (occupiedCount === 0 && room.status !== 'maintenance')
          ? `<button class="btn btn-primary" onclick="reserveRoom('${room.id}')" style="padding: 8px 16px; font-size: 13px;">
                     <i class="ri-bookmark-line"></i> Reserve
                   </button>`
          : ''
      }
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
  const html = `
    <div style="margin-bottom: 20px;">
      <h4 style="margin-bottom: 10px;">Room Management</h4>
      <p style="color: #6b7280; font-size: 14px;">Manage room allocation, availability, and maintenance status</p>
    </div>

    <div style="margin-bottom: 20px;">
      <input type="text" id="roomSearchInput" placeholder="Search by room number or floor..." 
             oninput="filterRoomManagementList()"
             style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
    </div>

    <div id="roomManagementList" style="max-height: 500px; overflow-y: auto;">
      ${generateRoomManagementList(roomList)}
    </div>
  `;

  const modalContent = `
    <div class="modal" id="roomManagementModal">
      <div class="modal-content" style="max-width: 800px;">
        <div class="modal-header">
          <h3>Room Management</h3>
          <button class="close-btn" onclick="closeModal('roomManagementModal')">×</button>
        </div>
        <div class="modal-body">
          ${html}
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal('roomManagementModal')">Close</button>
        </div>
      </div>
    </div>
  `;

  // Check if modal already exists
  let existingModal = document.getElementById('roomManagementModal');
  if (!existingModal) {
    document.body.insertAdjacentHTML('beforeend', modalContent);
  } else {
    existingModal.querySelector('.modal-body').innerHTML = html;
  }

  openModal('roomManagementModal');
}
