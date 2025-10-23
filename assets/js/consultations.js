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

function backToConsultation() {
    const consultationPage = document.getElementById("consultations-page");
    if (consultationPage) consultationPage.classList.remove("hide");

    const viewConsultation = document.getElementById("view-consultation-page");
    if (viewConsultation) viewConsultation.classList.remove("active");
}
