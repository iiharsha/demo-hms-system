/* Consultations Page */

const consultations = [
  {
    id: "C001",
    date: "2024-01-14",
    patient: "John Doe",
    doctor: "Dr. Smith",
    diagnosis: "Flu",
    status: "Completed",
  },
  {
    id: "C002",
    date: "2024-01-14",
    patient: "Jane Smith",
    doctor: "Dr. Jones",
    diagnosis: "Migraine",
    status: "Completed",
  },
];

function loadConsultations() {
  const table = document.getElementById("consultationsTable");
  table.innerHTML = consultations
    .map(
      (consult) => `
                <tr>
                    <td>${consult.id}</td>
                    <td>${consult.date}</td>
                    <td>${consult.patient}</td>
                    <td>${consult.doctor}</td>
                    <td>${consult.diagnosis}</td>
                    <td><span class="badge badge-success">${consult.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewConsultation('${consult.id}')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");
}

function saveConsultation() {
  const newConsultation = {
    id: "C" + String(consultations.length + 1).padStart(3, "0"),
    date: new Date().toISOString().split("T")[0],
    patient: patients[0].name, // Default to first patient for demo
    doctor: "Dr. Smith",
    diagnosis: document.getElementById("diagnosis").value || "General Checkup",
    status: "Completed",
  };

  consultations.push(newConsultation);
  loadConsultations();
  closeModal("newConsultationModal");
  showNotification("Consultation saved successfully!");
}

/* Search Consultations */
function searchConsultations() {
  const searchTerm = document
    .getElementById("consultationSearch")
    .value.toLowerCase();
  const filtered = consultations.filter(
    (c) =>
      c.patient.toLowerCase().includes(searchTerm) ||
      c.doctor.toLowerCase().includes(searchTerm) ||
      c.diagnosis.toLowerCase().includes(searchTerm)
  );

  const table = document.getElementById("consultationsTable");
  table.innerHTML = filtered
    .map(
      (consult) => `
                <tr>
                    <td>${consult.id}</td>
                    <td>${consult.date}</td>
                    <td>${consult.patient}</td>
                    <td>${consult.doctor}</td>
                    <td>${consult.diagnosis}</td>
                    <td><span class="badge badge-success">${consult.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewConsultation('${consult.id}')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");
}

function openNewConsultationModal() {
  openModal("newConsultationModal");
}

function viewConsultation(id) {
  // showNotification(`Viewing consultation ${id}`);
  const consultation = consultations.find((a) => a.id === id);
  if (!consultation) {
    console.error("Appointment not found", id);
    return;
  }

  const modalBody = document.getElementById("viewConsultationModalBody");

  modalBody.innerHTML = `
        <table>
            <tr><td><strong>ID:</strong></td><td>${consultation.id}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${consultation.date}</td></tr>
            <tr><td><strong>Patient:</strong></td><td>${consultation.patient}</td></tr>
            <tr><td><strong>Doctor:</strong></td><td>${consultation.doctor}</td></tr>
            <tr><td><strong>Diagnosis:</strong></td><td>${consultation.diagnosis}</td></tr>
            <tr><td><strong>Status:</strong></td><td>${consultation.status}</td></tr>
        </table>
    `;

  openModal("viewConsultationModal");
}
