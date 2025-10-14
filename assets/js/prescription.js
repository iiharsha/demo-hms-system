/** @type {Prescription[]} */
const prescriptions = [];

/**
 * Initialize patient search for prescription form
 */


/**
 * Add a new medicine row dynamically
 */

/**
 * Reset form
 */
function resetPrescriptionForm() {
  ["prescriptionDoctorName", "prescriptionNotes"].forEach(
    (id) => (DOM.get(id).value = "")
  );
  DOM.get("prescriptionPatientSearch").value = "";
  DOM.get("prescriptionPatientId").value = "";
  DOM.get("selectedPrescriptionPatientInfo").innerHTML = "";
}

/**
 * Save prescription
 */

