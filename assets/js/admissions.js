/* admissions page */

//TODO: i stopped here

/**
 * @typedef {Object} Admission
 * @property {string} id - Admission ID
 * @property {string} patient - Patient name
 * @property {string} room - Room number of the admitted patient.
 * @property {string} bed -  The bed name in the room.
 * @property {string} date - Admission Date.
 * @property {string} doctor - Doctor name
 * @property {string} status - 
 */

const admissions = [
  {
    id: "ADM001",
    patient: "Robert Johnson",
    room: "201",
    bed: "A",
    date: "2024-01-10",
    doctor: "Dr. Williams",
    status: "Active",
  },
  {
    id: "ADM002",
    patient: "Johnson Johnson",
    room: "202",
    bed: "A",
    date: "2024-01-10",
    doctor: "Dr. Williams",
    status: "Discharged",
  },
];

function loadAdmissions() {
  const table = document.getElementById("admissionsTable");
  table.innerHTML = admissions
    .map(
      (adm) => `
			<tr>
			<td>${adm.id}</td>
			<td>${adm.patient}</td>
			<td>${adm.room}</td>
			<td>${adm.bed}</td>
			<td>${adm.date}</td>
			<td>${adm.doctor}</td>
			<td><span class="badge badge-${adm.status === "Active" ? "success" : "warning"
        }">${adm.status}</span></td>
			<td>
			<button class="btn btn-primary" onclick="viewAdmission('${adm.id
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
			</td>
			</tr>
			`
    )
    .join("");
}

function filterAdmissions() {
  const status = document.getElementById("admissionStatusFilter").value;
  let filtered = admissions;

  if (status) {
    filtered = filtered.filter((a) => a.status.toLowerCase() === status);
  }

  const table = document.getElementById("admissionsTable");
  table.innerHTML = filtered
    .map(
      (adm) => `
			<tr>
			<td>${adm.id}</td>
			<td>${adm.patient}</td>
			<td>${adm.room}</td>
			<td>${adm.bed}</td>
			<td>${adm.date}</td>
			<td>${adm.doctor}</td>
			<td><span class="badge badge-${adm.status === "Active" ? "success" : "warning"
        }">${adm.status}</span></td>
			<td>
			<button class="btn btn-primary" onclick="viewAdmission('${adm.id
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
			</td>
			</tr>
            `
    )
    .join("");
}

/* basic implementation of viewing admission details */
function viewAdmission(id) {
  const adm = admissions.find((a) => a.id === id);
  console.log(adm);
  if (!adm) {
    console.error("Admission not found", id);
    return;
  }

  const modalBody = document.getElementById("viewAppointmentModalBody");

  modalBody.innerHTML = `
        <table>
            <tr><td><strong>ID:</strong></td><td>${adm.id}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${adm.date}</td></tr>
	    <tr><td><strong>Doctor:</strong></td><td>${adm.doctor}</td></tr>
            <tr><td><strong>Patient:</strong></td><td>${adm.patient}</td></tr>
            <tr><td><strong>Room:</strong></td><td>${adm.room}</td></tr>
            <tr><td><strong>Bed:</strong></td><td>${adm.bed}</td></tr>
            <tr><td><strong>Status:</strong></td><td>${adm.status}</td></tr>
        </table>
    `;

  openModal("viewAppointmentModal");
}

function openNewAdmissionModal() {
  openModal("newAdmissionModal");
}

function saveAdmission() {
  const newAdmission = {
    id: "ADM" + String(admissions.length + 1).padStart(3, "0"),
    patient:
      document.getElementById("admissionPatient").options[
        document.getElementById("admissionPatient").selectedIndex
      ].text,
    room: document.getElementById("roomNumber").value,
    bed: document.getElementById("bedNumber").value,
    date: new Date().toISOString().split("T")[0],
    doctor: document.getElementById("admittingDoctor").value,
    status: "Active",
  };

  admissions.push(newAdmission);
  loadAdmissions();
  closeModal("newAdmissionModal");
  showNotification("Patient admitted successfully!");
  initializeDashboard();
}
