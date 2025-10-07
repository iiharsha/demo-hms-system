/* Consultations Page */

const consultations = [
  {
    id: "C001",
    date: "2024-01-14",
    time: "10:00",
    patient: "John Doe",
    doctor: "Dr. Smith",
    diagnosis: "Flu",
    status: "Completed",
  },
  {
    id: "C002",
    date: "2024-01-14",
    time: "11:00",
    patient: "Jane Smith",
    doctor: "Dr. Jones",
    diagnosis: "Migraine",
    status: "Completed",
  },
  {
    id: "C003",
    date: "2024-01-15",
    time: "12:00",
    patient: "Donald Trump",
    doctor: "Dr. Williams",
    diagnosis: "Ear Condition",
    status: "Scheduled",
  },
  {
    id: "C004",
    date: "2025-01-15",
    time: "15:00",
    patient: "Micheal Jackson",
    doctor: "Dr. Smith",
    diagnosis: "Skin Rash",
    status: "Scheduled",
  },
];

/**
 * Initlialize the Cosultations page
 */
function loadConsultations() {
  const html = consultations
    .map(
      (consult) => `
                <tr>
                    <td>${consult.id}</td>
                    <td>${consult.date}</td>
                    <td>${consult.time}</td>
                    <td>${consult.patient}</td>
                    <td>${consult.doctor}</td>
                    <td>${consult.diagnosis}</td>
                    <td><span class="badge badge-${consult.status === "Completed" ? "success" : "primary"
        }">${consult.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewConsultation('${consult.id}')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");
  DOM.setHTML("consultationsTable", html);
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
  const searchTerm = DOM.getValue("consultationSearch").toLowerCase();
  const filtered = consultations.filter(
    (c) =>
      c.patient.toLowerCase().includes(searchTerm) ||
      c.doctor.toLowerCase().includes(searchTerm) ||
      c.diagnosis.toLowerCase().includes(searchTerm)
  );

  const html = filtered
    .map(
      (consult) => `
                <tr>
                    <td>${consult.id}</td>
                    <td>${consult.date}</td>
                    <td>${consult.time}</td>
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

  DOM.setHTML("consultationsTable", html);
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


  const html = `
        <table>
            <tr><td><strong>ID:</strong></td><td>${consultation.id}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${consultation.date}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${consultation.time}</td></tr>
            <tr><td><strong>Patient:</strong></td><td>${consultation.patient}</td></tr>
            <tr><td><strong>Doctor:</strong></td><td>${consultation.doctor}</td></tr>
            <tr><td><strong>Diagnosis:</strong></td><td>${consultation.diagnosis}</td></tr>
            <tr><td><strong>Status:</strong></td><td>${consultation.status}</td></tr>
        </table>
    `;

  DOM.setHTML("viewConsultationModalBody", html);
  openModal("viewConsultationModal");
}
