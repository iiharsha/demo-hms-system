/**
 * @typedef {Object} PatientMedication
 * @property {string} name - Name of the medication.
 * @property {string} dose - Dosage prescribed.
 * @property {string} frequency - Frequency of intake.
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {string} date - Date of the medical record.
 * @property {string} type - Type of medical encounter (Consultation, Admission, Emergency, Follow-up, etc.).
 * @property {string} doctor - Name of the doctor involved.
 * @property {string} diagnosis - Diagnosis given.
 * @property {string} notes - Additional notes.
 */

/**
 * @typedef {Object} LabReport
 * @property {string} date - Date of the lab test.
 * @property {string} test - Name of the test.
 * @property {string} result - Result of the test.
 * @property {string} file - File name/path for the report.
 */

/**
 * @typedef {Object} Immunization
 * @property {string} vaccine - Vaccine name.
 * @property {string} date - Date the vaccine was administered.
 * @property {string} nextDue - Next due date or status (e.g., "Completed").
 */

/**
 * @typedef {Object} Patient
 * @property {string} id - Patient ID
 * @property {string} name - Name of the patient.
 * @property {number} age - Age of the patient.
 * @property {"Male"|"Female"|"Other"} gender - gender of the patient.
 * @property {string} phone - Phone number of the patient.
 * @property {string} email - Email of the patient.
 * @property {"A+"|"A-"|"B+"|"B-"|"O+"|"O-"|"AB+"|"AB-"} bloodGroup - blood group of the patient.
 * @property {string} address - address of the patient.
 * @property {string} emergencyContact - emergency contact of the patient.
 * @property {string[]} allergies - list of allergies of the patient.
 * @property {string[]} chronicConditions - list of chronic conditions of the patient.
 * @property {PatientMedication[]} currentMedications - list of current medications of the patient.
 * @property {MedicalHistory[]} medicalHistory - list of medical history of the patient.
 * @property {LabReport[]} labReports - list of lab reports of the patient.
 * @property {Immunization[]} immunizations - list of immunizations of the patient.
 */

/**
 * List of patients
 * @type {Patient[]}
 */
const patients = [
  {
    id: "P001",
    name: "John Doe",
    age: 35,
    gender: "Male",
    phone: "9876543210",
    email: "john@email.com",
    bloodGroup: "O+",
    address: "123 Main Street, Ahmedabad",
    emergencyContact: "9876543211",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    currentMedications: [
      { name: "Metformin", dose: "500mg", frequency: "Twice daily" },
      { name: "Lisinopril", dose: "10mg", frequency: "Once daily" },
    ],
    medicalHistory: [
      {
        date: "2024-01-10",
        type: "Consultation",
        doctor: "Dr. Smith",
        diagnosis: "Hypertension",
        notes: "Blood pressure elevated, started on Lisinopril",
      },
      {
        date: "2023-12-15",
        type: "Emergency",
        doctor: "Dr. Jones",
        diagnosis: "Acute Bronchitis",
        notes: "Prescribed antibiotics and rest",
      },
      {
        date: "2023-11-20",
        type: "Check-up",
        doctor: "Dr. Smith",
        diagnosis: "Routine Check-up",
        notes: "All vitals normal",
      },
    ],
    labReports: [
      {
        date: "2024-01-10",
        test: "Complete Blood Count",
        result: "Normal",
        file: "CBC_001.pdf",
      },
      {
        date: "2024-01-10",
        test: "Lipid Profile",
        result: "High Cholesterol",
        file: "LIPID_001.pdf",
      },
    ],
    immunizations: [
      { vaccine: "COVID-19", date: "2023-03-15", nextDue: "2024-03-15" },
      { vaccine: "Influenza", date: "2023-10-01", nextDue: "2024-10-01" },
    ],
  },
  {
    id: "P002",
    name: "Jane Smith",
    age: 28,
    gender: "Female",
    phone: "9876543211",
    email: "jane@email.com",
    bloodGroup: "A+",
    address: "456 Park Avenue, Ahmedabad",
    emergencyContact: "9876543212",
    allergies: ["Sulfa drugs"],
    chronicConditions: ["Asthma"],
    currentMedications: [
      { name: "Albuterol Inhaler", dose: "90mcg", frequency: "As needed" },
    ],
    medicalHistory: [
      {
        date: "2024-01-08",
        type: "Follow-up",
        doctor: "Dr. Williams",
        diagnosis: "Asthma Management",
        notes: "Well controlled on current medication",
      },
      {
        date: "2023-09-10",
        type: "Consultation",
        doctor: "Dr. Smith",
        diagnosis: "Migraine",
        notes: "Prescribed Sumatriptan for acute episodes",
      },
    ],
    labReports: [
      {
        date: "2023-12-20",
        test: "Thyroid Function",
        result: "Normal",
        file: "THYROID_002.pdf",
      },
    ],
    immunizations: [
      { vaccine: "COVID-19", date: "2023-04-20", nextDue: "2024-04-20" },
      { vaccine: "Tetanus", date: "2022-06-15", nextDue: "2032-06-15" },
    ],
  },
  {
    id: "P003",
    name: "Robert Johnson",
    age: 42,
    gender: "Male",
    phone: "9876543212",
    email: "robert@email.com",
    bloodGroup: "B+",
    address: "789 Lake Road, Ahmedabad",
    emergencyContact: "9876543213",
    allergies: [],
    chronicConditions: ["High Cholesterol"],
    currentMedications: [
      { name: "Atorvastatin", dose: "20mg", frequency: "Once daily at night" },
    ],
    medicalHistory: [
      {
        date: "2024-01-12",
        type: "Admission",
        doctor: "Dr. Williams",
        diagnosis: "Appendicitis",
        notes: "Appendectomy performed, recovery ongoing",
      },
      {
        date: "2023-10-05",
        type: "Consultation",
        doctor: "Dr. Jones",
        diagnosis: "High Cholesterol",
        notes: "Started on statin therapy",
      },
    ],
    labReports: [
      {
        date: "2024-01-05",
        test: "Lipid Profile",
        result: "Improving",
        file: "LIPID_003.pdf",
      },
      {
        date: "2024-01-12",
        test: "Pre-operative Panel",
        result: "Normal",
        file: "PREOP_003.pdf",
      },
    ],
    immunizations: [
      { vaccine: "COVID-19", date: "2023-05-10", nextDue: "2024-05-10" },
      { vaccine: "Hepatitis B", date: "2023-01-15", nextDue: "Completed" },
    ],
  },
  {
    id: "P069",
    name: "Ram Singh",
    age: 21,
    gender: "Male",
    phone: "1234123412",
    email: "ramsingh@email.com",
    bloodGroup: "B+",
    address: "789 Lake Road, Ahmedabad",
    emergencyContact: "9876543213",
    allergies: [],
    chronicConditions: ["High Cholesterol"],
    currentMedications: [
      { name: "Atorvastatin", dose: "20mg", frequency: "Once daily at night" },
    ],
    medicalHistory: [
      {
        date: "2024-01-12",
        type: "Admission",
        doctor: "Dr. Williams",
        diagnosis: "Appendicitis",
        notes: "Appendectomy performed, recovery ongoing",
      },
      {
        date: "2023-10-05",
        type: "Consultation",
        doctor: "Dr. Jones",
        diagnosis: "High Cholesterol",
        notes: "Started on statin therapy",
      },
    ],
    labReports: [
      {
        date: "2024-01-05",
        test: "Lipid Profile",
        result: "Improving",
        file: "LIPID_003.pdf",
      },
      {
        date: "2024-01-12",
        test: "Pre-operative Panel",
        result: "Normal",
        file: "PREOP_003.pdf",
      },
    ],
    immunizations: [
      { vaccine: "COVID-19", date: "2023-05-10", nextDue: "2024-05-10" },
      { vaccine: "Hepatitis B", date: "2023-01-15", nextDue: "Completed" },
    ],
  },
];


/** Billing */
const bills = [
  {
    id: "B001",
    patient: "John Doe",
    date: "2024-01-14",
    amount: "₹5,000",
    status: "Paid",
  },
  {
    id: "B002",
    patient: "Jane Smith",
    date: "2024-01-14",
    amount: "₹3,500",
    status: "Pending",
  },
];

/** Rooms */
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


/** Inventory page */
const inventory = [
  {
    code: "MED001",
    name: "Paracetamol",
    category: "Medicine",
    quantity: 500,
    unit: "Tablets",
    status: "In Stock",
  },
  {
    code: "MED002",
    name: "Amoxicillin",
    category: "Medicine",
    quantity: 100,
    unit: "Capsules",
    status: "Low Stock",
  },
  {
    code: "EQP001",
    name: "Blood Pressure Monitor",
    category: "Equipment",
    quantity: 5,
    unit: "Units",
    status: "In Stock",
  },
];
