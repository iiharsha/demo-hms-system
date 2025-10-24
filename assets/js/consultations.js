function loadConsultations() {
    const htmlPatientQueue = patients
        .map(
            (patient) => `
                <tr>
                    <td>${patient.id}</td>
                    <td>${patient.name}</td>
                    <td>${patient.phone}</td>
                    <td>${patient.medicalHistory?.[0]?.weight || "—"}</td>
                    <td>${patient.gender}</td>
                    <td>
                        <button class="action-btn action-btn-primary" onclick="editPatientInQueue('${patient.id}')" title="Edit Patient In Queue">
                          <i class="ri-edit-2-line"></i>
                        </button>
                        <button class="action-btn action-btn-primary" onclick="viewConsultation('${patient.id}')" title="View Patient In Queue">
                            <i class="ri-eye-line"></i>
                        </button>
                        <button class="action-btn action-btn-danger" onclick="deleteConsultingPatientInQueue('${patient.id}')" title="Delete Patient">
                            <i class="ri-delete-bin-6-line"></i>
                        </button>
                    </td>
                </tr>
            `,
        )
        .join("");

    const htmlTodaysInvoice = invoices
        .map((invoice) => {
            const patient = getPatientDetails(invoice.patientId);
            return `
                <tr>
                    <td>${invoice.id}</td>
                    <td>${patient ? patient.name : "Unknown"}</td>
                    <td>${patient ? patient.phone : "—"}</td>
                    <td>${patient ? patient.age : "—"}</td>
                    <td>${patient ? patient.gender : "—"}</td>
                    <td>
                        <button class="action-btn action-btn-primary" onclick="editPatientInQueue('${invoice.id}')" title="Edit Patient In Queue">
                          <i class="ri-edit-2-line"></i>
                        </button>
                        <button class="action-btn action-btn-primary" onclick="viewPatientInQueue('${invoice.id}')" title="View Patient In Queue">
                            <i class="ri-eye-line"></i>
                        </button>
                        <button class="action-btn action-btn-danger" onclick="deleteConsultingPatient('${patient.id}')" title="Delete Patient">
                            <i class="ri-delete-bin-6-line"></i>
                        </button>
                    </td>
                </tr>
            `;
        })
        .join("");

    DOM.setHTML("consultationsManagePatientsQueue", htmlPatientQueue);
    DOM.setHTML("consultationsTodaysInvoice", htmlTodaysInvoice);
}

// Global variable to track current consultation
let currentConsultationPatientId = null;

function viewConsultation(patientId) {
    currentConsultationPatientId = patientId;

    const consultationPage = document.getElementById("consultations-page");
    if (consultationPage) consultationPage.classList.add("hide");

    const viewConsultation = document.getElementById("view-consultation-page");
    if (viewConsultation) viewConsultation.classList.add("active");

    // Load patient data into the consultation view
    loadConsultationPatientData(patientId);
}

function loadConsultationPatientData(patientId) {
    const patient = patients.find((p) => p.id === patientId);

    if (!patient) {
        showNotification("Patient not found!", "error");
        return;
    }

    // Update header with patient info
    document.getElementById("patientNameDisplay").textContent = patient.name;
    document.getElementById("patientIdDisplay").textContent = patient.id;

    // Patient tab
    const consultationPatientName = document.getElementById(
        "consultationPatientName",
    );
    if (consultationPatientName) {
        consultationPatientName.textContent = `${patient.name} (${patient.age}y, ${patient.gender}) - ${patient.phone}`;
    }

    // Load latest vitals if available
    const latestHistory = patient.medicalHistory?.[0];
    if (latestHistory && latestHistory.weight) {
        const weightInput = document.querySelector(
            "#view-consultation-page #weight",
        );
        if (weightInput) weightInput.value = latestHistory.weight;
    }

    // Load procedures dropdown
    loadProceduresDropdown();

    // Load medicines dropdown
    loadMedicinesDropdown();
}

function loadProceduresDropdown() {
    const select = document.getElementById("consultationsAddProcedures");
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="">-- Select Procedure --</option>';

    // Add procedures
    procedures.forEach((proc) => {
        const option = document.createElement("option");
        option.value = proc.id;
        option.textContent = `${proc.name} - ₹${proc.price}`;
        option.dataset.name = proc.name;
        option.dataset.price = proc.price;
        select.appendChild(option);
    });

    // Make it multi-select or add button to add multiple
    select.setAttribute("multiple", "true");
    select.style.height = "120px";
}

function loadMedicinesDropdown() {
    const select = document.getElementById("consultationsAddMedications");
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="">-- Select Medicine --</option>';

    // Add medicines that are in stock
    inventory
        .filter((med) => med.status === "In Stock" && med.quantity > 0)
        .forEach((med) => {
            const option = document.createElement("option");
            option.value = med.code;
            option.textContent = `${med.name} (${med.quantity} available) - ₹${med.unitPrice}`;
            option.dataset.name = med.name;
            option.dataset.price = med.unitPrice;
            option.dataset.code = med.code;
            select.appendChild(option);
        });

    // Make it multi-select
    select.setAttribute("multiple", "true");
    select.style.height = "120px";
}

function backToConsultation() {
    const consultationPage = document.getElementById("consultations-page");
    if (consultationPage) consultationPage.classList.remove("hide");

    const viewConsultation = document.getElementById("view-consultation-page");
    if (viewConsultation) viewConsultation.classList.add("hide");

    // Clear consultation data
    clearConsultationForm();
    currentConsultationPatientId = null;
}

function clearConsultationForm() {
    // Clear vitals
    const vitalFields = ["bloodPressure", "heartRate", "temperature", "weight"];
    vitalFields.forEach((field) => {
        const input = document.querySelector(
            `#view-consultation-page #${field}`,
        );
        if (input) input.value = "";
    });

    // Clear symptoms
    const symptomFields = ["chiefComplaint", "historyIllness"];
    symptomFields.forEach((field) => {
        const input = document.querySelector(
            `#view-consultation-page #${field}`,
        );
        if (input) input.value = "";
    });

    // Clear diagnosis
    const diagnosisFields = ["physicalExam", "diagnosis"];
    diagnosisFields.forEach((field) => {
        const input = document.querySelector(
            `#view-consultation-page #${field}`,
        );
        if (input) input.value = "";
    });

    // Clear prescription selections
    const procedureSelect = document.getElementById(
        "consultationsAddProcedures",
    );
    if (procedureSelect) procedureSelect.selectedIndex = -1;

    const medicineSelect = document.getElementById(
        "consultationsAddMedications",
    );
    if (medicineSelect) medicineSelect.selectedIndex = -1;
}

function saveConsultationData() {
    if (!currentConsultationPatientId) {
        showNotification("No patient selected!", "error");
        return;
    }

    const patient = patients.find((p) => p.id === currentConsultationPatientId);
    if (!patient) {
        showNotification("Patient not found!", "error");
        return;
    }

    // Gather vitals data
    const vitals = {
        bloodPressure:
            document.querySelector("#view-consultation-page #bloodPressure")
                ?.value || "",
        heartRate:
            document.querySelector("#view-consultation-page #heartRate")
                ?.value || "",
        temperature:
            document.querySelector("#view-consultation-page #temperature")
                ?.value || "",
        weight:
            document.querySelector("#view-consultation-page #weight")?.value ||
            "",
    };

    // Gather symptoms data
    const symptoms = {
        chiefComplaint:
            document.querySelector("#view-consultation-page #chiefComplaint")
                ?.value || "",
        historyIllness:
            document.querySelector("#view-consultation-page #historyIllness")
                ?.value || "",
    };

    // Gather diagnosis data
    const diagnosis = {
        physicalExam:
            document.querySelector("#view-consultation-page #physicalExam")
                ?.value || "",
        diagnosis:
            document.querySelector("#view-consultation-page #diagnosis")
                ?.value || "",
    };

    // Get selected procedures
    const procedureSelect = document.getElementById(
        "consultationsAddProcedures",
    );
    const selectedProcedures = [];
    if (procedureSelect) {
        const selectedOptions = Array.from(procedureSelect.selectedOptions);
        selectedOptions.forEach((option) => {
            selectedProcedures.push({
                name: option.dataset.name,
                price: parseFloat(option.dataset.price),
            });
        });
    }

    // Get selected medicines
    const medicineSelect = document.getElementById(
        "consultationsAddMedications",
    );
    const selectedMedicines = [];
    if (medicineSelect) {
        const selectedOptions = Array.from(medicineSelect.selectedOptions);
        selectedOptions.forEach((option) => {
            // Default quantity to 10 for demo - in production, you'd want to ask for quantity
            const quantity = 10;
            const unitPrice = parseFloat(option.dataset.price);
            selectedMedicines.push({
                name: option.dataset.name,
                code: option.dataset.code,
                quantity: quantity,
                unitPrice: unitPrice,
                total: quantity * unitPrice,
            });
        });
    }

    // Validate required fields
    if (!diagnosis.diagnosis) {
        showNotification("Please enter a diagnosis!", "error");
        return;
    }

    // Add to patient's medical history
    const newHistory = {
        date: new Date().toISOString().split("T")[0],
        type: "Consultation",
        doctor: "Dr. Smith", // You might want to get this from logged-in user
        diagnosis: diagnosis.diagnosis,
        complains: symptoms.chiefComplaint,
        weight: vitals.weight,
        notes:
            `BP: ${vitals.bloodPressure}, HR: ${vitals.heartRate}, Temp: ${vitals.temperature}\n` +
            `Physical Exam: ${diagnosis.physicalExam}\n` +
            `History: ${symptoms.historyIllness}`,
        medications: selectedMedicines.map((med) => ({
            name: med.name,
            dose: "As prescribed",
            frequency: "As directed",
        })),
    };

    // Add to beginning of medical history
    if (!patient.medicalHistory) {
        patient.medicalHistory = [];
    }
    patient.medicalHistory.unshift(newHistory);

    // Create or update invoice
    const invoiceId = "INV" + String(invoices.length + 1).padStart(4, "0");
    const totalAmount =
        selectedProcedures.reduce((sum, proc) => sum + proc.price, 0) +
        selectedMedicines.reduce((sum, med) => sum + med.total, 0);

    const newInvoice = {
        id: invoiceId,
        patientId: patient.id,
        date: new Date().toISOString().split("T")[0],
        proceduresPerformed: selectedProcedures,
        medicationsBilled: selectedMedicines,
        totalAmount: totalAmount,
        status: "Pending",
    };

    invoices.push(newInvoice);

    // Update inventory quantities
    selectedMedicines.forEach((med) => {
        const inventoryItem = inventory.find((item) => item.code === med.code);
        if (inventoryItem) {
            inventoryItem.quantity -= med.quantity;
            if (inventoryItem.quantity <= 0) {
                inventoryItem.status = "Out of Stock";
            } else if (inventoryItem.quantity < 10) {
                inventoryItem.status = "Low Stock";
            }
        }
    });

    showNotification("Consultation saved successfully! Invoice created.");

    // Reload consultations page
    loadConsultations();

    // Go back to consultations
    backToConsultation();
}
// Edit Patient in Queue
function editPatientInQueue(patientId) {
    const patient = patients.find((p) => p.id === patientId);

    if (!patient) {
        showNotification("Patient not found!", "error");
        return;
    }

    // Create and show edit modal
    const modalHtml = `
        <div class="modal" id="editPatientModal" style="display: flex;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Patient - ${patient.id}</h2>
                    <button class="close-btn" onclick="closeEditPatientModal()">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Patient Name *</label>
                        <input type="text" id="editPatientName" value="${patient.name}" required />
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Mobile *</label>
                            <input type="tel" id="editPatientPhone" value="${patient.phone}" required />
                        </div>
                        <div class="form-group">
                            <label>Age</label>
                            <input type="number" id="editPatientAge" value="${patient.age}" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Gender *</label>
                            <select id="editPatientGender" required>
                                <option value="M" ${patient.gender === "M" ? "selected" : ""}>Male</option>
                                <option value="F" ${patient.gender === "F" ? "selected" : ""}>Female</option>
                                <option value="O" ${patient.gender === "O" ? "selected" : ""}>Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Weight (kg)</label>
                            <input type="text" id="editPatientWeight" value="${patient.medicalHistory?.[0]?.weight || ""}" placeholder="e.g., 70kg" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <textarea id="editPatientAddress" rows="2">${patient.address || ""}</textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeEditPatientModal()">
                        Cancel
                    </button>
                    <button class="btn btn-primary" onclick="savePatientEdit('${patient.id}')">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById("editPatientModal");
    if (existingModal) existingModal.remove();

    // Add modal to body
    document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function closeEditPatientModal() {
    const modal = document.getElementById("editPatientModal");
    if (modal) modal.remove();
}

function savePatientEdit(patientId) {
    const patient = patients.find((p) => p.id === patientId);

    if (!patient) {
        showNotification("Patient not found!", "error");
        return;
    }

    // Get updated values
    const name = document.getElementById("editPatientName")?.value.trim();
    const phone = document.getElementById("editPatientPhone")?.value.trim();
    const age = document.getElementById("editPatientAge")?.value.trim();
    const gender = document.getElementById("editPatientGender")?.value;
    const weight = document.getElementById("editPatientWeight")?.value.trim();
    const address = document.getElementById("editPatientAddress")?.value.trim();

    // Validate required fields
    if (!name || !phone || !gender) {
        showNotification("Please fill all required fields!", "error");
        return;
    }

    // Update patient data
    patient.name = name;
    patient.phone = phone;
    patient.age = age ? parseInt(age) : patient.age;
    patient.gender = gender;
    patient.address = address || patient.address;

    // Update weight in medical history
    if (weight) {
        if (!patient.medicalHistory) {
            patient.medicalHistory = [];
        }

        // Update latest history or create new entry
        if (patient.medicalHistory.length > 0) {
            patient.medicalHistory[0].weight = weight;
        } else {
            patient.medicalHistory.push({
                date: new Date().toISOString().split("T")[0],
                weight: weight,
                type: "Update",
                notes: "Weight updated",
            });
        }
    }

    showNotification("Patient information updated successfully!");

    // Reload consultations
    loadConsultations();

    // Close modal
    closeEditPatientModal();
}

// Delete Patient from Consulting Queue
function deleteConsultingPatientInQueue(patientId) {
    const patient = patients.find((p) => p.id === patientId);

    if (!patient) {
        showNotification("Patient not found!", "error");
        return;
    }

    // Show confirmation dialog
    const confirmed = confirm(
        `Are you sure you want to remove ${patient.name} from the consultation queue?\n\n` +
            `This will NOT delete the patient record, only remove them from today's queue.`,
    );

    if (!confirmed) return;

    // Remove patient from the patients array (consultation queue)
    const index = patients.findIndex((p) => p.id === patientId);
    if (index !== -1) {
        patients.splice(index, 1);
        showNotification(`${patient.name} removed from consultation queue.`);
        loadConsultations();
    }
}

// Delete Patient from Invoice (Today's Consultation)
function deleteConsultingPatient(patientId) {
    const patient = patients.find((p) => p.id === patientId);

    if (!patient) {
        showNotification("Patient not found!", "error");
        return;
    }

    // Find related invoices
    const relatedInvoices = invoices.filter(
        (inv) => inv.patientId === patientId,
    );

    if (relatedInvoices.length === 0) {
        showNotification("No invoices found for this patient!", "error");
        return;
    }

    // Show confirmation with invoice details
    const invoiceIds = relatedInvoices.map((inv) => inv.id).join(", ");
    const confirmed = confirm(
        `Are you sure you want to delete consultations for ${patient.name}?\n\n` +
            `This will delete the following invoice(s): ${invoiceIds}\n\n` +
            `Associated medications will be returned to inventory.`,
    );

    if (!confirmed) return;

    // Return medications to inventory before deleting
    relatedInvoices.forEach((invoice) => {
        if (invoice.medicationsBilled && invoice.medicationsBilled.length > 0) {
            invoice.medicationsBilled.forEach((med) => {
                const inventoryItem = inventory.find(
                    (item) => item.code === med.code || item.name === med.name,
                );
                if (inventoryItem) {
                    inventoryItem.quantity += med.quantity;
                    // Update status
                    if (inventoryItem.quantity > 10) {
                        inventoryItem.status = "In Stock";
                    } else if (inventoryItem.quantity > 0) {
                        inventoryItem.status = "Low Stock";
                    }
                }
            });
        }
    });

    // Remove invoices
    relatedInvoices.forEach((invoice) => {
        const invIndex = invoices.findIndex((inv) => inv.id === invoice.id);
        if (invIndex !== -1) {
            invoices.splice(invIndex, 1);
        }
    });

    showNotification(
        `Consultation records deleted for ${patient.name}. Medications returned to inventory.`,
    );
    loadConsultations();
}

// View Patient in Invoice Queue
function viewPatientInQueue(invoiceId) {
    const invoice = invoices.find((inv) => inv.id === invoiceId);

    if (!invoice) {
        showNotification("Invoice not found!", "error");
        return;
    }

    const patient = patients.find((p) => p.id === invoice.patientId);

    if (!patient) {
        showNotification("Patient not found!", "error");
        return;
    }

    // Create view modal
    const modalHtml = `
        <div class="modal" id="viewPatientInvoiceModal" style="display: flex;">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Consultation Details - ${invoice.id}</h2>
                    <button class="close-btn" onclick="closeViewPatientInvoiceModal()">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info" style="margin-bottom: 1.5rem;">
                        <i class="ri-user-line"></i>
                        <div style="flex: 1;">
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                                <div><strong>Name:</strong> ${patient.name}</div>
                                <div><strong>ID:</strong> ${patient.id}</div>
                                <div><strong>Phone:</strong> ${patient.phone}</div>
                                <div><strong>Age:</strong> ${patient.age}</div>
                                <div><strong>Gender:</strong> ${patient.gender === "M" ? "Male" : patient.gender === "F" ? "Female" : "Other"}</div>
                                <div><strong>Date:</strong> ${invoice.date}</div>
                            </div>
                        </div>
                    </div>

                    ${
                        invoice.proceduresPerformed &&
                        invoice.proceduresPerformed.length > 0
                            ? `
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: var(--gray-700);">
                            <i class="ri-surgical-mask-line"></i> Procedures Performed
                        </h3>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Procedure</th>
                                        <th style="text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${invoice.proceduresPerformed
                                        .map(
                                            (proc) => `
                                        <tr>
                                            <td>${proc.name}</td>
                                            <td style="text-align: right;">₹${proc.price}</td>
                                        </tr>
                                    `,
                                        )
                                        .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    `
                            : ""
                    }

                    ${
                        invoice.medicationsBilled &&
                        invoice.medicationsBilled.length > 0
                            ? `
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: var(--gray-700);">
                            <i class="ri-capsule-line"></i> Medications Prescribed
                        </h3>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Medicine</th>
                                        <th style="text-align: center;">Quantity</th>
                                        <th style="text-align: right;">Unit Price</th>
                                        <th style="text-align: right;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${invoice.medicationsBilled
                                        .map(
                                            (med) => `
                                        <tr>
                                            <td>${med.name}</td>
                                            <td style="text-align: center;">${med.quantity}</td>
                                            <td style="text-align: right;">₹${med.unitPrice}</td>
                                            <td style="text-align: right;">₹${med.total}</td>
                                        </tr>
                                    `,
                                        )
                                        .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    `
                            : ""
                    }

                    <div class="alert alert-success">
                        <i class="ri-money-rupee-circle-line"></i>
                        <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="font-size: 1.1rem;">Total Amount: ₹${invoice.totalAmount}</strong>
                                <div style="margin-top: 0.25rem;">
                                    <span class="badge ${invoice.status === "Paid" ? "badge-success" : "badge-warning"}">
                                        ${invoice.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeViewPatientInvoiceModal()">
                        Close
                    </button>
                    <button class="btn btn-primary" onclick="printInvoice('${invoice.id}')">
                        <i class="ri-printer-line"></i> Print Invoice
                    </button>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById("viewPatientInvoiceModal");
    if (existingModal) existingModal.remove();

    // Add modal to body
    document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function closeViewPatientInvoiceModal() {
    const modal = document.getElementById("viewPatientInvoiceModal");
    if (modal) modal.remove();
}

function printInvoice(invoiceId) {
    // This is a placeholder - implement actual printing logic
    showNotification("Print functionality will be implemented soon!");
    console.log("Printing invoice:", invoiceId);
}

// Helper function if not already defined
function getPatientDetails(patientId) {
    return patients.find((p) => p.id === patientId);
}
