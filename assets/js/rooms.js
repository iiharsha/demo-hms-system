/* Rooms & Beds Page */

/**
 * @typedef {Object} Bed
 * @property {string} bed - bed identifier (A,B,C,D, etc...)
 ** @property {string|null} patient - Name of the patient assigned to the bed, or null if empty
 * @property {string} [patientId] - Unique patient ID (optional, only if occupied)
 * @property {string} [admissionDate] - Date of admission in YYYY-MM-DD format (optional, only if occupied)/

/**
 * @typedef {Object} Room
 * @property {string} id - Room ID
 * @property {number} floor - the floor which the room is on.
 * @property {"general"|"private"|"semi-private"|"maternity"|"icu"|"pediatric"} type - the type of room
 * @property {number} totalBeds - the total number of beds in a room.
 * @property {Bed[]} occupiedBeds - list of beds in the room with the patient info or null.
 * @property {"available"|"occupied"|"maintenance"|"reserved"} status - current room status
 * @property {number} rate - daily room rate in rupees.
 */

/** 
 * List of hospital rooms with bed and patient occupancy information.
 * @type {Room[]}
 */
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

/** Renders the rooms page by calculating statistics and updating the UI.
 * Also renders the room grid and room table.
 *
 * @param {Array<Object>} [roomsList=rooms] - Optional list of rooms to render (defaults to global rooms).
 * @returns {void}
 */
function loadRooms(roomsList = rooms) {
  // Calculate statistics
  let totalBeds = 0;
  let occupiedBedsCount = 0;
  let availableBedsCount = 0;

  roomsList.forEach((room) => {
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

  document.getElementById("totalRooms").textContent = roomsList.length;
  document.getElementById("availableRooms").textContent = availableBedsCount;
  document.getElementById("occupiedRooms").textContent = occupiedBedsCount;
  document.getElementById("occupancyRate").textContent = occupancyRate + "%";

  renderRoomGrid();
  loadRoomTable();
}

/** 
 * Currently selected room ID.
 * @type {string|null}
 */
let currentRoomId = null;

/**
 * opens a modal showing details of the room with the given roomId
 *
 * @param {string} roomId - the unique id of the room to view.
 * @returns {void}
 */
function viewRoomDetails(roomId) {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;

  /* Store current room ID */
  currentRoomId = roomId;

  const occupiedCount = room.occupiedBeds.filter((b) => b.patient).length;
  const availableCount = room.totalBeds - occupiedCount;

  const html = `
  <div class="room-details-grid-2">
    <div>
      <label class="label">Room Number</label>
      <p class="room-details-room-id">${room.id}</p>
    </div>
    <div>
      <label class="label">Ward Type</label>
      <p class="room-details-ward-type">${formatRoomType(room.type)}</p>
    </div>
    <div>
      <label class="label">Floor</label>
      <p class="room-details-floor-text">Floor ${room.floor}</p>
    </div>
    <div>
      <label class="label">Daily Rate</label>
      <p class="room-details-daily-rate">₹${room.rate}</p>
    </div>
  </div>

  <div class="room-details-card">
    <h4>Occupancy Status</h4>
    <div class="room-details-grid-3">
      <div class="room-details-occupancy-block">
        <div class="room-details-occupancy-value" style="color: var(--primary);">
          ${room.totalBeds}
        </div>
        <div class="room-details-occupancy-label">Total Beds</div>
      </div>
      <div class="room-details-occupancy-block">
        <div class="room-details-occupancy-value" style="color: var(--warning);">
          ${occupiedCount}
        </div>
        <div class="room-details-occupancy-label">Occupied</div>
      </div>
      <div class="room-details-occupancy-block">
        <div class="room-details-occupancy-value" style="color: var(--secondary);">
          ${availableCount}
        </div>
        <div class="room-details-occupancy-label">Available</div>
      </div>
    </div>
  </div>

  <h4 style="margin-bottom: 15px;">Bed Details</h4>
  <div class="room-details-grid-gap-10">
    ${room.occupiedBeds.map((bed) => {
    const isOccupied = bed.patient !== null;

    return `
        <div class="room-details-bed-card ${isOccupied ? 'occupied' : 'available'}">
          <div>
            <div class="room-details-bed-title">Bed ${bed.bed}</div>
            ${isOccupied
        ? `<div class="room-details-bed-details">
                    <strong>Patient:</strong> ${bed.patient}<br>
                    <strong>ID:</strong> ${bed.patientId}<br>
                    <strong>Admission:</strong> ${bed.admissionDate}
                  </div>`
        : `<div class="room-details-bed-available">
                    Available for admission
                  </div>`
      }
          </div>
          <div>
            ${isOccupied
        ? '<span class="badge badge-warning">Occupied</span>'
        : '<span class="badge badge-success">Available</span>'
      }
          </div>
        </div>
      `;
  }).join("")}
  </div>
`;

  document.getElementById("roomDetailsContent").innerHTML = html;
  openModal("roomDetailsModal");
}

/**
 * Render the dynamic room card grid grouped by floor
 *
 * @param {Array<Object>} [roomsList=rooms] - Optional list of rooms to render (defaults to global rooms).
 * @returns {void}
 */
function renderRoomGrid(roomsList = rooms) {
  const roomGrid = document.getElementById("roomGrid");

  if (!roomGrid) {
    console.log("no element with id #roomGrid found")
    return;
  }

  /* Group rooms by floor */
  const roomsByFloor = {};
  (roomsList || []).forEach((room) => {
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

  if (!html) html = `<div class="no-results" >
                      <i class="ri-alert-line" style="color: var(--warning);"></i>
                      No rooms match the selected filters.
                    </div > `;
  roomGrid.innerHTML = html;
}

/**
 * Loads the room table into the #roomsTable element.
 *
 * @param {Array<Object>} [roomsList=rooms] - Optional list of rooms to render (defaults to global rooms).
 * @returns {string} - HTML to render the room table.
 */
function loadRoomTable(roomsList = rooms) {
  const table = document.getElementById("roomsTable");

  table.innerHTML = roomsList
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

/**
 * Convert the internal room type keys into readable text.
 *
 * @param {string} type - Room type
 * @returns {string} Converted name of the room type.
 */
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
 * then re-render the room grid.
 *
 * @returns {void}
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

/**
 * Export the room data into CSV format.
 *
 * @param {Array<Object>} roomList - list of rooms to render.
 * @returns {void}
 */
function exportRoomData(roomsList) {
  const data = roomsList.map((r) => ({
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

/* initialize on DOM ready */
document.addEventListener("DOMContentLoaded", () => {
  renderRoomGrid();
});
