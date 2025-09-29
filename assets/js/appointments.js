/* Appointments Page */

const appointments = [
  {
    id: "A001",
    date: "2024-01-15",
    time: "10:00",
    patient: "John Doe",
    doctor: "Dr. Smith",
    type: "Consultation",
    status: "Scheduled",
  },
  {
    id: "A002",
    date: "2024-01-15",
    time: "11:00",
    patient: "Jane Smith",
    doctor: "Dr. Jones",
    type: "Follow-up",
    status: "Completed",
  },
  {
    id: "A003",
    date: "2024-01-15",
    time: "12:00",
    patient: "Donald Trump",
    doctor: "Dr. Williams",
    type: "Follow-up",
    status: "Scheduled",
  },
  {
    id: "A004",
    date: "2025-01-15",
    time: "12:00",
    patient: "Micheal Jackson",
    doctor: "Dr. Williams",
    type: "Follow-up",
    status: "Scheduled",
  },
];

function loadAppointments() {
  const table = document.getElementById("appointmentsTable");
  table.innerHTML = appointments
    .map(
      (apt) => `
                <tr>
                    <td>${apt.id}</td>
                    <td>${apt.date}</td>
                    <td>${apt.time}</td>
                    <td>${apt.patient}</td>
                    <td>${apt.doctor}</td>
                    <td>${apt.type}</td>
                    <td><span class="badge badge-${apt.status === "Completed" ? "success" : "primary"
        }">${apt.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewAppointment('${apt.id
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");
}

function filterAppointmentsByDate(data, date) {
  if (!date) return data;
  return data.filter((a) => a.date === date);
}

function filterAppointmentsByDoctor(data, doctor) {
  if (!doctor) return data; // if no doctor filter, return original data
  return data.filter((a) =>
    a.doctor.toLowerCase().includes(doctor.split("-")[1])
  );
}

function renderAppointments(filtered) {
  const table = document.getElementById("appointmentsTable");
  table.innerHTML = filtered
    .map(
      (apt) => `
            <tr>
                <td>${apt.id}</td>
                <td>${apt.date}</td>
                <td>${apt.time}</td>
                <td>${apt.patient}</td>
                <td>${apt.doctor}</td>
                <td>${apt.type}</td>
                <td><span class="badge badge-${apt.status === "Completed" ? "success" : "primary"
        }">${apt.status}</span></td>
                <td>
                    <button class="btn btn-primary" onclick="viewAppointment('${apt.id
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                </td>
            </tr>`
    )
    .join("");
}

function filterAppointments() {
  const date = document.getElementById("appointmentDate").value;
  const doctor = document.getElementById("doctorFilter").value;

  let filtered = appointments;

  filtered = filterAppointmentsByDate(filtered, date);

  filtered = filterAppointmentsByDoctor(filtered, doctor);

  renderAppointments(filtered);
}

/* basic implementation of viewing appointment details */
function viewAppointment(id) {
  const apt = appointments.find((a) => a.id === id);
  if (!apt) {
    console.error("Appointment not found", id);
    return;
  }

  const modalBody = document.getElementById("viewAppointmentModalBody");

  modalBody.innerHTML = `
        <table>
            <tr><td><strong>ID:</strong></td><td>${apt.id}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${apt.date}</td></tr>
            <tr><td><strong>Time:</strong></td><td>${apt.time}</td></tr>
            <tr><td><strong>Patient:</strong></td><td>${apt.patient}</td></tr>
            <tr><td><strong>Doctor:</strong></td><td>${apt.doctor}</td></tr>
            <tr><td><strong>Type:</strong></td><td>${apt.type}</td></tr>
            <tr><td><strong>Status:</strong></td><td>${apt.status}</td></tr>
        </table>
    `;

  openModal("viewAppointmentModal");
}

function saveAppointment() {
  const selectedSlot = document.querySelector(".appointment-slot.selected");
  if (!selectedSlot) {
    alert("Please select a time slot");
    return;
  }

  const newAppointment = {
    id: "A" + String(appointments.length + 1).padStart(3, "0"),
    date: document.getElementById("appointmentDateInput").value,
    time: selectedSlot.dataset.time,
    patient:
      document.getElementById("appointmentPatient").options[
        document.getElementById("appointmentPatient").selectedIndex
      ].text,
    doctor: document.getElementById("appointmentDoctor").value.split(" - ")[0],
    type: document.getElementById("appointmentType").value,
    status: "Scheduled",
  };

  appointments.push(newAppointment);
  loadAppointments();
  closeModal("addAppointmentModal");
  showNotification("Appointment scheduled successfully!");
  initializeDashboard();
}

function openAddAppointmentModal() {
  openModal("addAppointmentModal");
}
