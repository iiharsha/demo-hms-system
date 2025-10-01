/* Rooms & Beds Page */

/* Need to go through this again for now i left it as it is */
const rooms = [
  // First Floor - General Ward
  {
    id: "R101",
    floor: 1,
    type: "general",
    totalBeds: 4,
    occupiedBeds: [
      {
        bed: "A",
        patient: "John Doe",
        patientId: "P001",
        admissionDate: "2024-01-10",
      },
      { bed: "B", patient: null },
      {
        bed: "C",
        patient: "Mary Wilson",
        patientId: "P004",
        admissionDate: "2024-01-12",
      },
      { bed: "D", patient: null },
    ],
    status: "available",
    rate: 1000,
  },
  {
    id: "R102",
    floor: 1,
    type: "general",
    totalBeds: 4,
    occupiedBeds: [
      { bed: "A", patient: null },
      { bed: "B", patient: null },
      { bed: "C", patient: null },
      { bed: "D", patient: null },
    ],
    status: "available",
    rate: 1000,
  },
  {
    id: "R103",
    floor: 1,
    type: "general",
    totalBeds: 4,
    occupiedBeds: [
      {
        bed: "A",
        patient: "Robert Johnson",
        patientId: "P003",
        admissionDate: "2024-01-11",
      },
      {
        bed: "B",
        patient: "Alice Brown",
        patientId: "P005",
        admissionDate: "2024-01-13",
      },
      {
        bed: "C",
        patient: "David Lee",
        patientId: "P006",
        admissionDate: "2024-01-14",
      },
      {
        bed: "D",
        patient: "Sarah Miller",
        patientId: "P007",
        admissionDate: "2024-01-14",
      },
    ],
    status: "occupied",
    rate: 1000,
  },

  // First Floor - Private Rooms
  {
    id: "R104",
    floor: 1,
    type: "private",
    totalBeds: 1,
    occupiedBeds: [{ bed: "A", patient: null }],
    status: "available",
    rate: 3500,
  },
  {
    id: "R105",
    floor: 1,
    type: "private",
    totalBeds: 1,
    occupiedBeds: [
      {
        bed: "A",
        patient: "Emma Davis",
        patientId: "P008",
        admissionDate: "2024-01-13",
      },
    ],
    status: "occupied",
    rate: 3500,
  },

  // Second Floor - Semi-Private
  {
    id: "R201",
    floor: 2,
    type: "semi-private",
    totalBeds: 2,
    occupiedBeds: [
      {
        bed: "A",
        patient: "James Wilson",
        patientId: "P009",
        admissionDate: "2024-01-12",
      },
      { bed: "B", patient: null },
    ],
    status: "available",
    rate: 2000,
  },
  {
    id: "R202",
    floor: 2,
    type: "semi-private",
    totalBeds: 2,
    occupiedBeds: [
      { bed: "A", patient: null },
      { bed: "B", patient: null },
    ],
    status: "maintenance",
    rate: 2000,
  },
  {
    id: "R203",
    floor: 2,
    type: "semi-private",
    totalBeds: 2,
    occupiedBeds: [
      {
        bed: "A",
        patient: "Linda Garcia",
        patientId: "P010",
        admissionDate: "2024-01-11",
      },
      {
        bed: "B",
        patient: "Michael Chen",
        patientId: "P011",
        admissionDate: "2024-01-13",
      },
    ],
    status: "occupied",
    rate: 2000,
  },

  // Second Floor - ICU
  {
    id: "R204",
    floor: 2,
    type: "icu",
    totalBeds: 1,
    occupiedBeds: [
      {
        bed: "A",
        patient: "Critical Patient 1",
        patientId: "P012",
        admissionDate: "2024-01-14",
      },
    ],
    status: "occupied",
    rate: 5000,
  },
  {
    id: "R205",
    floor: 2,
    type: "icu",
    totalBeds: 1,
    occupiedBeds: [{ bed: "A", patient: null }],
    status: "available",
    rate: 5000,
  },
  {
    id: "R206",
    floor: 2,
    type: "icu",
    totalBeds: 1,
    occupiedBeds: [{ bed: "A", patient: null }],
    status: "reserved",
    rate: 5000,
  },

  // Third Floor - Maternity Ward
  {
    id: "R301",
    floor: 3,
    type: "maternity",
    totalBeds: 2,
    occupiedBeds: [
      {
        bed: "A",
        patient: "Jane Smith",
        patientId: "P002",
        admissionDate: "2024-01-14",
      },
      { bed: "B", patient: null },
    ],
    status: "available",
    rate: 2500,
  },
  {
    id: "R302",
    floor: 3,
    type: "maternity",
    totalBeds: 2,
    occupiedBeds: [
      { bed: "A", patient: null },
      { bed: "B", patient: null },
    ],
    status: "available",
    rate: 2500,
  },

  // Third Floor - Pediatric Ward
  {
    id: "R303",
    floor: 3,
    type: "pediatric",
    totalBeds: 3,
    occupiedBeds: [
      {
        bed: "A",
        patient: "Child Patient 1",
        patientId: "P013",
        admissionDate: "2024-01-13",
      },
      { bed: "B", patient: null },
      { bed: "C", patient: null },
    ],
    status: "available",
    rate: 1800,
  },
  {
    id: "R304",
    floor: 3,
    type: "pediatric",
    totalBeds: 3,
    occupiedBeds: [
      { bed: "A", patient: null },
      { bed: "B", patient: null },
      { bed: "C", patient: null },
    ],
    status: "available",
    rate: 1800,
  },
];

function loadRooms() {
  // Calculate statistics
  let totalBeds = 0;
  let occupiedBedsCount = 0;
  let availableBedsCount = 0;

  rooms.forEach((room) => {
    totalBeds += room.totalBeds;
    room.occupiedBeds.forEach((bed) => {
      if (bed.patient) {
        occupiedBedsCount++;
      } else {
        availableBedsCount++;
      }
    });
  });

  const occupancyRate = Math.round((occupiedBedsCount / totalBeds) * 100);

  // Update stats
  document.getElementById("totalRooms").textContent = rooms.length;
  document.getElementById("availableRooms").textContent = availableBedsCount;
  document.getElementById("occupiedRooms").textContent = occupiedBedsCount;
  document.getElementById("occupancyRate").textContent = occupancyRate + "%";

  /* Load room grid */
  renderRoomGrid();

  // Load room table
  loadRoomTable();
}

/* global variable to track the current room */
let currentRoomId = null;

/**
 * View room details
 */
function viewRoomDetails(roomId) {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;

  /* Store current room ID globally */
  currentRoomId = roomId;

  const occupiedCount = room.occupiedBeds.filter((b) => b.patient).length;
  const availableCount = room.totalBeds - occupiedCount;

  const html = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
      <div>
        <label style="color: #6b7280; font-size: 12px;">Room Number</label>
        <p style="font-size: 24px; font-weight: 600; color: var(--primary);">${room.id}</p>
      </div>
      <div>
        <label style="color: #6b7280; font-size: 12px;">Ward Type</label>
        <p style="font-size: 18px;">${formatRoomType(room.type)}</p>
      </div>
      <div>
        <label style="color: #6b7280; font-size: 12px;">Floor</label>
        <p>Floor ${room.floor}</p>
      </div>
      <div>
        <label style="color: #6b7280; font-size: 12px;">Daily Rate</label>
        <p style="font-size: 18px; font-weight: 600;">₹${room.rate}</p>
      </div>
    </div>
    
    <div style="background: var(--light); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h4 style="margin-bottom: 15px;">Occupancy Status</h4>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 600; color: var(--primary);">${room.totalBeds}</div>
          <div style="font-size: 12px; color: #6b7280;">Total Beds</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 600; color: var(--warning);">${occupiedCount}</div>
          <div style="font-size: 12px; color: #6b7280;">Occupied</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 600; color: var(--secondary);">${availableCount}</div>
          <div style="font-size: 12px; color: #6b7280;">Available</div>
        </div>
      </div>
    </div>
    
    <h4 style="margin-bottom: 15px;">Bed Details</h4>
    <div style="display: grid; gap: 10px;">
      ${room.occupiedBeds
      .map((bed) => {
        const isOccupied = bed.patient !== null;
        const bgColor = isOccupied ? "var(--warning)" : "var(--secondary)";

        return `
            <div style="background: ${isOccupied ? "#fef3c7" : "#d1fae5"};
            padding: 15px; border-radius: 8px; border-left: 4px solid ${bgColor};">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">
                    Bed ${bed.bed}
                  </div>
                  ${isOccupied
            ? `
                    <div style="color: #6b7280; font-size: 14px;">
                      <strong>Patient:</strong> ${bed.patient}<br>
                      <strong>ID:</strong> ${bed.patientId}<br>
                      <strong>Admission:</strong> ${bed.admissionDate}
                    </div>
                    `
            : `
                    <div style="color: var(--secondary); font-weight: 500;">
                      Available for admission
                    </div>
                    `
          }
                </div>
                <div>
                  ${isOccupied
            ? '<span class="badge badge-warning">Occupied</span>'
            : '<span class="badge badge-success">Available</span>'
          }
                </div>
              </div>
            </div>
          `;
      })
      .join("")}
    </div>
  `;

  document.getElementById("roomDetailsContent").innerHTML = html;
  openModal("roomDetailsModal");
}

/* render the dynamic room card */
function renderRoomGrid(roomList = rooms) {
  const roomGrid = document.getElementById("roomGrid");

  if (!roomGrid) {
    console.log("no element with id #roomGrid found")
    return;
  }

  /* Group rooms by floor */
  const roomsByFloor = {};
  (roomList || []).forEach((room) => {
    const floorKey = String(room.floor ?? "0")
    if (!roomsByFloor[floorKey]) roomsByFloor[floorKey] = [];
    roomsByFloor[floorKey].push(room);
  })

  const floorKeys = Object.keys(roomsByFloor)
    .map((k) => Number(k)).sort((a, b) => a - b);

  let html = "";

  floorKeys.forEach((floor) => {
    const roomsForFloor = roomsByFloor[floor];
    html += `
        <div class="floor-section" style="grid-column: 1/-1;">
            <div class="floor-header">
                <div class="floor-title">Floor ${floor}</div>
                <div style="font-size: 14px; color: #6b7280;">
                    ${roomsForFloor.length} rooms
                </div>
            </div>
        <div class="room-grid">
          `;

    roomsForFloor.forEach((room) => {
      const occupiedCount = (room.occupiedBeds || []).filter((b) => !!b.patient).length;
      const totalBeds = Number(room.totalBeds) || (room.occupiedBeds ? room.occupiedBeds.length : 0);
      const availableCount = totalBeds - occupiedCount;


      let statusClass = "available";
      if (room.status === "maintenance") {
        statusClass = "maintenance";
      } else if (room.status === "reserved") {
        statusClass = "reserved";
      } else if (occupiedCount === totalBeds && totalBeds > 0) {
        statusClass = "occupied";
      }

      const bedIndicators = (room.occupiedBeds || [])
        .map((bed) => {
          let bedClass = bed.patient ? "occupied" : "available";
          if (room.status === "reserved" && !bed.patient) bedClass = "reserved";
          const tooltip = `Bed ${bed.bed}: ${bed.patient || "Available"}`;
          return `<div class="bed-indicator ${bedClass}" title="${tooltip}">${bed.bed}</div>`;
        })
        .join("");

      html += `
        <div class="room-card ${statusClass}" onclick="viewRoomDetails('${room.id}')">
          <div class="room-header">
            <div>
              <div class="room-number">${room.id} 
                ${room.status === "maintenance"
          ? `<span class="maintenance-label" title="Under Maintenance">
                            <i class="ri-alert-line" style="color: var(--warning); margin-left: 6px;"></i>
                          </span>`
          : ""
        }
              </div>
        <div class="room-type">${typeof formatRoomType === 'function' ? formatRoomType(room.type) : room.type}</div>
            </div >
        <div style="text-align: right;">
          <div style="font-size: 20px; font-weight: 600; color: ${occupiedCount === 0
          ? "var(--secondary)"
          : occupiedCount === totalBeds
            ? "var(--danger)"
            : "var(--warning)"
        }">
          ${occupiedCount}/${totalBeds}
        </div>

            </div >
          </div >

          <div class="bed-indicators">${bedIndicators}</div>

          <div class="room-stats">
            <div class="room-stat">
              <div class="room-stat-value">${occupiedCount}</div>
              <div class="room-stat-label">Occupied</div>
            </div>
            <div class="room-stat">
              <div class="room-stat-value">${availableCount}</div>
              <div class="room-stat-label">Available</div>
            </div>
            <div class="room-stat">
              <div class="room-stat-value">₹${room.rate ?? "--"}</div>
              <div class="room-stat-label">Per Day</div>
            </div>
          </div>
        </div >
        `;
    });

    html += `
        </div >
        </div >
        `;
  });

  if (!html) html = `< div class="no-results" > No rooms match the selected filters.</div > `;
  roomGrid.innerHTML = html;
}

function loadRoomTable() {
  const table = document.getElementById("roomsTable");

  table.innerHTML = rooms
    .map((room) => {
      const occupiedCount = room.occupiedBeds.filter((b) => b.patient).length;
      const availableCount = room.totalBeds - occupiedCount;
      const patients = room.occupiedBeds
        .filter((b) => b.patient)
        .map((b) => b.patient);

      let statusBadge = "";
      if (room.status === "maintenance") {
        statusBadge = '<span class="badge badge-danger">Maintenance</span>';
      } else if (room.status === "reserved") {
        statusBadge = '<span class="badge badge-primary">Reserved</span>';
      } else if (occupiedCount === room.totalBeds) {
        statusBadge = '<span class="badge badge-warning">Full</span>';
      } else if (occupiedCount > 0) {
        statusBadge = '<span class="badge badge-warning">Partial</span>';
      } else {
        statusBadge = '<span class="badge badge-success">Available</span>';
      }

      return `
        <tr>
                        <td>${room.id}</td>
                        <td>${formatRoomType(room.type)}</td>
                        <td>Floor ${room.floor}</td>
                        <td>${room.totalBeds}</td>
                        <td>${occupiedCount}</td>
                        <td>${availableCount}</td>
                        <td>${patients.length > 0 ? patients.join(", ") : "-"
        }</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="btn btn-primary" onclick="viewRoomDetails('${room.id
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                        </td>
                    </tr >
        `;
    })
    .join("");
}

function formatRoomType(type) {
  const types = {
    general: "General Ward",
    private: "Private Room",
    "semi-private": "Semi-Private",
    icu: "ICU",
    maternity: "Maternity",
    pediatric: "Pediatric",
  };
  return types[type] || type;
}

/**
 * Filter the rooms based on Ward, Floor, and Room Status
 */
function filterRooms() {
  const wardFilter = document.getElementById("wardFilter").value;
  const floorFilter = document.getElementById("floorFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;

  let filteredRooms = (rooms || []).slice();

  if (wardFilter) {
    filteredRooms = filteredRooms.filter((r) => String(r.type) === wardFilter);
  }

  if (floorFilter) {
    /* compare as strings so types (string/number) both work */
    filteredRooms = filteredRooms.filter((r) => String(r.floor) === floorFilter);
  }

  if (statusFilter) {
    if (statusFilter === "available") {
      filteredRooms = filteredRooms.filter(
        (r) =>
          r.status !== "maintenance" && (r.occupiedBeds || []).some((b) => !b.patient)
      );
    } else if (statusFilter === "occupied") {
      filteredRooms = filteredRooms.filter(
        (r) => (r.occupiedBeds || []).length > 0 && (r.occupiedBeds || []).every((b) => !!b.patient)
      )
    } else {
      filteredRooms = filteredRooms.filter((r) => r.status === statusFilter);
    }
  }

  console.log(filteredRooms);

  renderRoomGrid(filteredRooms);
}

function openRoomManagementModal() {
  showNotification("Room management modal would open here");
}

function exportRoomData() {
  const data = rooms.map((r) => ({
    RoomNumber: r.id,
    Floor: r.floor,
    Type: formatRoomType(r.type),
    TotalBeds: r.totalBeds,
    Occupied: r.occupiedBeds.filter((b) => b.patient).length,
    Available: r.totalBeds - r.occupiedBeds.filter((b) => b.patient).length,
    Status: r.status,
    RatePerDay: r.rate,
  }));
  exportToCSV(data, "room_occupancy_report.csv");
  showNotification("Room occupancy report exported");
}

// function assignPatientToRoom() {
//   showNotification("Patient assignment feature would be implemented here");
// }

// function dischargeFromRoom() {
//   showNotification("Patient discharge feature would be implemented here");
// }


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
      <h4 style="margin-bottom: 10px;">Assign Patient to Room ${room.id}</h4>
      <p style="color: #6b7280; font-size: 14px;">Select a patient and bed for admission</p>
    </div>

    <form id="assignPatientForm" onsubmit="handlePatientAssignment(event); return false;">
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Select Patient *</label>
        <select id="patientSelect" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
          <option value="">-- Select Patient --</option>
          ${availablePatients.map(p => `
            <option value="${p.id}">
              ${p.name} (${p.id}) - Age: ${p.age}, ${p.gender}
            </option>
          `).join('')}
        </select>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Select Bed *</label>
        <select id="bedSelect" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
          <option value="">-- Select Bed --</option>
          ${availableBeds.map(bed => `
            <option value="${bed.bed}">Bed ${bed.bed}</option>
          `).join('')}
        </select>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Admission Date *</label>
        <input type="date" id="admissionDate" required value="${new Date().toISOString().split('T')[0]}" 
               style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Admission Notes</label>
        <textarea id="admissionNotes" rows="3" placeholder="Enter any admission notes or special instructions..."
                  style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
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
    <div style="margin-bottom: 20px;">
      <h4 style="margin-bottom: 10px;">Discharge Patient from Room ${room.id}</h4>
      <p style="color: #6b7280; font-size: 14px;">Select a patient to discharge</p>
    </div>

    <form id="dischargePatientForm" onsubmit="handlePatientDischarge(event); return false;">
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Select Patient *</label>
        <select id="dischargePatientSelect" required onchange="updateDischargeDetails()" 
                style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
          <option value="">-- Select Patient --</option>
          ${occupiedBeds.map(bed => `
            <option value="${bed.bed}" data-patient-id="${bed.patientId}" data-admission="${bed.admissionDate}">
              Bed ${bed.bed}: ${bed.patient} (${bed.patientId})
            </option>
          `).join('')}
        </select>
      </div>

      <div id="patientDetailsSection" style="display: none; background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h5 style="margin-bottom: 10px; font-size: 14px;">Patient Details</h5>
        <div id="patientDetailsContent" style="font-size: 14px; color: #6b7280;"></div>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Discharge Date *</label>
        <input type="date" id="dischargeDate" required value="${new Date().toISOString().split('T')[0]}" 
               style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Discharge Reason *</label>
        <select id="dischargeReason" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
          <option value="">-- Select Reason --</option>
          <option value="recovered">Recovered</option>
          <option value="transferred">Transferred to Another Facility</option>
          <option value="home_care">Home Care</option>
          <option value="ama">Against Medical Advice (AMA)</option>
          <option value="deceased">Deceased</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Discharge Summary / Notes</label>
        <textarea id="dischargeNotes" rows="4" placeholder="Enter discharge summary, follow-up instructions, prescriptions, etc..."
                  style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
      </div>

      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid var(--warning); margin-bottom: 20px;">
        <div style="display: flex; gap: 10px;">
          <i class="ri-alert-line" style="color: var(--warning); font-size: 20px;"></i>
          <div>
            <strong style="color: var(--warning);">Important</strong>
            <p style="font-size: 14px; color: #92400e; margin-top: 5px; margin-bottom: 0;">
              This will mark the bed as available and remove the patient from the room. Make sure all billing and documentation is complete before discharge.
            </p>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button type="button" class="btn btn-outline" onclick="closeDischargeModal()" style="flex: 1;">Cancel</button>
        <button type="submit" class="btn btn-primary" style="flex: 1;">Discharge Patient</button>
      </div>
    </form>
  `;

  document.getElementById('dischargeModalBody').innerHTML = html;
  openModal('dischargePatientModal');
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
  const bed = room.occupiedBeds.find(b => b.bed === bedId);

  if (!room || !bed) {
    showNotification('Invalid selection', 'error');
    return false;
  }

  const patientName = bed.patient;
  const patientId = bed.patientId;

  // Store discharge record (you could save this to a discharge history array)
  const dischargeRecord = {
    roomId: roomId,
    bedId: bedId,
    patientName: patientName,
    patientId: patientId,
    admissionDate: bed.admissionDate,
    dischargeDate: dischargeDate,
    reason: dischargeReason,
    notes: notes,
    timestamp: new Date().toISOString()
  };

  console.log('Discharge Record:', dischargeRecord);

  // Clear the bed
  bed.patient = null;
  bed.patientId = null;
  bed.admissionDate = null;
  bed.admissionNotes = null;

  // Update room status
  const occupiedCount = room.occupiedBeds.filter(b => b.patient).length;
  if (occupiedCount === 0) {
    room.status = 'available';
  } else {
    room.status = 'available'; // Has some available beds
  }

  // Close modals and refresh
  closeDischargeModal();
  closeModal('roomDetailsModal');

  showNotification(`${patientName} discharged from Room ${roomId}, Bed ${bedId}`, 'success');

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
 * Close discharge modal
 */
function closeDischargeModal() {
  closeModal('dischargePatientModal');
}
/* initialize on DOM ready */
document.addEventListener("DOMContentLoaded", () => {
  // populateFilters();
  renderRoomGrid();
});
