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

  // Load room grid
  loadRoomGrid();

  // Load room table
  loadRoomTable();
}

function viewRoomDetails(roomId) {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;

  const occupiedCount = room.occupiedBeds.filter((b) => b.patient).length;
  const availableCount = room.totalBeds - occupiedCount;

  const html = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <label style="color: #6b7280; font-size: 12px;">Room Number</label>
                        <p style="font-size: 24px; font-weight: 600; color: var(--primary);">${
                          room.id
                        }</p>
                    </div>
                    <div>
                        <label style="color: #6b7280; font-size: 12px;">Ward Type</label>
                        <p style="font-size: 18px;">${formatRoomType(
                          room.type
                        )}</p>
                    </div>
                    <div>
                        <label style="color: #6b7280; font-size: 12px;">Floor</label>
                        <p>Floor ${room.floor}</p>
                    </div>
                    <div>
                        <label style="color: #6b7280; font-size: 12px;">Daily Rate</label>
                        <p style="font-size: 18px; font-weight: 600;">₹${
                          room.rate
                        }</p>
                    </div>
                </div>
                
                <div style="background: var(--light); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 15px;">Occupancy Status</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 600; color: var(--primary);">${
                              room.totalBeds
                            }</div>
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
                        const bgColor = isOccupied
                          ? "var(--warning)"
                          : "var(--secondary)";
                        const textColor = "white";

                        return `
                            <div style="background: ${
                              isOccupied ? "#fef3c7" : "#d1fae5"
                            }; padding: 15px; border-radius: 8px; border-left: 4px solid ${bgColor};">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">
                                            Bed ${bed.bed}
                                        </div>
                                        ${
                                          isOccupied
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
                                        ${
                                          isOccupied
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

function loadRoomGrid() {
  const roomGrid = document.getElementById("roomGrid");

  // Group rooms by floor
  const roomsByFloor = {};
  rooms.forEach((room) => {
    if (!roomsByFloor[room.floor]) {
      roomsByFloor[room.floor] = [];
    }
    roomsByFloor[room.floor].push(room);
  });

  let html = "";

  Object.keys(roomsByFloor)
    .sort()
    .forEach((floor) => {
      html += `
                    <div class="floor-section" style="grid-column: 1/-1;">
                        <div class="floor-header">
                            <div class="floor-title">Floor ${floor}</div>
                            <div style="font-size: 14px; color: #6b7280;">
                                ${roomsByFloor[floor].length} rooms
                            </div>
                        </div>
                        <div class="room-grid">
                `;

      roomsByFloor[floor].forEach((room) => {
        const occupiedCount = room.occupiedBeds.filter((b) => b.patient).length;
        const availableCount = room.totalBeds - occupiedCount;
        const occupancyPercent = Math.round(
          (occupiedCount / room.totalBeds) * 100
        );

        let statusClass = "available";
        if (room.status === "maintenance") {
          statusClass = "maintenance";
        } else if (room.status === "reserved") {
          statusClass = "reserved";
        } else if (occupiedCount === room.totalBeds) {
          statusClass = "occupied";
        }

        html += `
                        <div class="room-card ${statusClass}" onclick="viewRoomDetails('${
          room.id
        }')">
                            <div class="room-header">
                                <div>
                                    <div class="room-number">Room ${
                                      room.id
                                    }</div>
                                    <div class="room-type">${formatRoomType(
                                      room.type
                                    )}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 20px; font-weight: 600; color: ${
                                      occupiedCount === room.totalBeds
                                        ? "var(--warning)"
                                        : "var(--secondary)"
                                    }">
                                        ${occupancyPercent}%
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bed-indicators">
                                ${room.occupiedBeds
                                  .map((bed, index) => {
                                    let bedClass = bed.patient
                                      ? "occupied"
                                      : "available";
                                    if (
                                      room.status === "reserved" &&
                                      !bed.patient
                                    )
                                      bedClass = "reserved";
                                    return `<div class="bed-indicator ${bedClass}" title="Bed ${
                                      bed.bed
                                    }: ${bed.patient || "Available"}">${
                                      bed.bed
                                    }</div>`;
                                  })
                                  .join("")}
                            </div>
                            
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
                                    <div class="room-stat-value">₹${
                                      room.rate
                                    }</div>
                                    <div class="room-stat-label">Per Day</div>
                                </div>
                            </div>
                        </div>
                    `;
      });

      html += `
                        </div>
                    </div>
                `;
    });

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
                        <td>${
                          patients.length > 0 ? patients.join(", ") : "-"
                        }</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="btn btn-primary" onclick="viewRoomDetails('${
                              room.id
                            }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                        </td>
                    </tr>
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

function filterRooms() {
  const wardFilter = document.getElementById("wardFilter").value;
  const floorFilter = document.getElementById("floorFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;

  let filteredRooms = rooms;

  if (wardFilter) {
    filteredRooms = filteredRooms.filter((r) => r.type === wardFilter);
  }

  if (floorFilter) {
    filteredRooms = filteredRooms.filter(
      (r) => r.floor === parseInt(floorFilter)
    );
  }

  if (statusFilter) {
    if (statusFilter === "available") {
      filteredRooms = filteredRooms.filter(
        (r) =>
          r.status !== "maintenance" && r.occupiedBeds.some((b) => !b.patient)
      );
    } else if (statusFilter === "occupied") {
      filteredRooms = filteredRooms.filter((r) =>
        r.occupiedBeds.every((b) => b.patient)
      );
    } else {
      filteredRooms = filteredRooms.filter((r) => r.status === statusFilter);
    }
  }

  // Temporarily replace rooms array for display
  const originalRooms = rooms;
  rooms = filteredRooms;
  loadRooms();
  rooms = originalRooms;
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

function assignPatientToRoom() {
  showNotification("Patient assignment feature would be implemented here");
}

function dischargeFromRoom() {
  showNotification("Patient discharge feature would be implemented here");
}
