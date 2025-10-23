// --- PATIENTS ---
let patients = [
    {
        id: "PT1234",
        name: "John Doe",
        age: 35,
        gender: "M",
        phone: "9876543210",
        address: "123 Main Street, Ahmedabad",
        medicalHistory: [
            {
                date: "2024-01-10",
                type: "Consultation",
                doctor: "Dr. Smith",
                diagnosis: "Hypertension",
                notes: "Blood pressure elevated, started on Lisinopril",
                medications: [
                    {
                        name: "Lisinopril",
                        dose: "10mg",
                        frequency: "Once daily",
                    },
                    {
                        name: "Metformin",
                        dose: "500mg",
                        frequency: "Twice daily",
                    },
                ],
            },
            {
                date: "2023-12-15",
                type: "Emergency",
                doctor: "Dr. Jones",
                diagnosis: "Acute Bronchitis",
                notes: "Prescribed antibiotics and rest",
                medications: [
                    {
                        name: "Amoxicillin 500mg",
                        dose: "500mg",
                        frequency: "Thrice daily",
                    },
                ],
            },
            {
                date: "2023-11-20",
                type: "Check-up",
                doctor: "Dr. Smith",
                diagnosis: "Routine Check-up",
                notes: "All vitals normal",
                medications: [],
            },
        ],
        labReports: [
            {
                date: "2024-01-10",
                test: "Complete Blood Count",
                result: "Normal",
                file: "CBC_001.pdf",
            },
        ],
    },
    {
        id: "PT1235",
        name: "Jane Smith",
        age: 28,
        gender: "F",
        phone: "9876543211",
        address: "456 Park Avenue, Ahmedabad",
        medicalHistory: [
            {
                date: "2024-01-08",
                type: "Follow-up",
                doctor: "Dr. Williams",
                diagnosis: "Asthma Management",
                notes: "Well controlled on current medication",
                medications: [
                    {
                        name: "Albuterol Inhaler",
                        dose: "90mcg",
                        frequency: "As needed",
                    },
                ],
            },
            {
                date: "2023-09-10",
                type: "Consultation",
                doctor: "Dr. Smith",
                diagnosis: "Migraine",
                notes: "Prescribed Sumatriptan for acute episodes",
                medications: [
                    {
                        name: "Sumatriptan",
                        dose: "50mg",
                        frequency: "As needed",
                    },
                ],
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
    },
    {
        id: "PT1236",
        name: "Robert Johnson",
        age: 42,
        gender: "M",
        phone: "9876543212",
        address: "789 Lake Road, Ahmedabad",
        medicalHistory: [
            {
                date: "2024-01-12",
                type: "Admission",
                doctor: "Dr. Williams",
                diagnosis: "Appendicitis",
                notes: "Appendectomy performed, recovery ongoing",
                medications: [
                    {
                        name: "Ceftriaxone",
                        dose: "1g",
                        frequency: "Twice daily",
                    },
                    {
                        name: "Paracetamol",
                        dose: "500mg",
                        frequency: "Thrice daily",
                    },
                ],
            },
            {
                date: "2023-10-05",
                type: "Consultation",
                doctor: "Dr. Jones",
                diagnosis: "High Cholesterol",
                notes: "Started on statin therapy",
                medications: [
                    {
                        name: "Atorvastatin",
                        dose: "20mg",
                        frequency: "Once daily",
                    },
                ],
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
    },
];

// --- PROCEDURES (Master List) ---
const procedures = [
    { id: 1, name: "Ear Piercing under LA", price: 500 },
    { id: 2, name: "Mastoidectomy with Tympanoplasty under GA", price: 2500 },
    { id: 3, name: "Injection for vomiting relief", price: 300 },
    { id: 4, name: "Trachestomy Closure", price: 2000 },
    { id: 5, name: "Ear Wick insertion", price: 300 },
    { id: 6, name: "Anaestheist's charges", price: 700 },
    { id: 7, name: "Room Charges", price: 1500 },
    {
        id: 8,
        name: "Septoplasty with Bilateral Turbinate Reduction under GA",
        price: 1000,
    },
    { id: 9, name: "Injection for Pain relief", price: 600 },
];

// --- INVENTORY (Master Medicines List) ---
let inventory = [
    {
        code: "MED001",
        name: "Paracetamol",
        category: "Pain-Relief",
        quantity: 45,
        unitPrice: 30,
        status: "In Stock",
        expiryDate: "2026-11-20",
    },
    {
        code: "MED002",
        name: "Amoxicillin 500mg",
        category: "Antibiotics",
        quantity: 250,
        unitPrice: 420,
        status: "Low Stock",
        expiryDate: "2027-03-14",
    },
    {
        code: "DIAB001",
        name: "Metformin 500mg",
        category: "Diabetes",
        quantity: 120,
        unitPrice: 85,
        status: "In Stock",
        expiryDate: "2027-08-25",
    },
    {
        code: "CARD001",
        name: "Atorvastatin 20mg",
        category: "Cardiovascular",
        quantity: 200,
        unitPrice: 150,
        status: "In Stock",
        expiryDate: "2027-09-05",
    },
];

// --- INVOICES (Billing Data Only) ---
let invoices = [
    {
        id: "INV1234",
        patientId: "PT1234",
        date: "2025-10-17",
        proceduresPerformed: [
            { name: "Ear Piercing under LA", price: 500 },
            { name: "Room Charges", price: 1500 },
        ],
        medicationsBilled: [
            {
                name: "Lisinopril 10mg",
                quantity: 10,
                unitPrice: 85,
                total: 850,
            },
            {
                name: "Metformin 500mg",
                quantity: 20,
                unitPrice: 85,
                total: 1700,
            },
        ],
        totalAmount: 500 + 1500 + 850 + 1700, // 4550
        status: "Paid",
    },
    {
        id: "INV1235",
        patientId: "PT1235",
        date: "2025-10-19",
        proceduresPerformed: [
            { name: "Injection for Pain relief", price: 600 },
        ],
        medicationsBilled: [
            {
                name: "Sumatriptan 50mg",
                quantity: 5,
                unitPrice: 120,
                total: 600,
            },
        ],
        totalAmount: 600 + 600, // 1200
        status: "Pending",
    },
    {
        id: "INV1236",
        patientId: "PT1236",
        date: "2025-10-21",
        proceduresPerformed: [
            { name: "Trachestomy Closure", price: 2000 },
            { name: "Anaestheist's charges", price: 700 },
        ],
        medicationsBilled: [
            { name: "Paracetamol", quantity: 15, unitPrice: 30, total: 450 },
            {
                name: "Atorvastatin 20mg",
                quantity: 10,
                unitPrice: 150,
                total: 1500,
            },
        ],
        totalAmount: 2000 + 700 + 450 + 1500, // 4650
        status: "Paid",
    },
];

/** Billing */
let bills = [
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

let sales = [
    {
        id: "SL001",
        date: "2025-10-28",
        customerName: "John Doe",
        prescriptionNumber: "1234123",
        medicine: "Paracetamol 500mg",
        quantity: 1,
        modeOfPatment: ["UPI", "Cash"],
        totalPrice: "₹30",
        status: "Completed",
    },
    {
        id: "SL002",
        date: "2025-10-28",
        customerName: "Sarah Bill",
        prescriptionNumber: "1234123",
        medicine: "Amoxicillin 500mg",
        quantity: 2,
        modeOfPatment: ["UPI"],
        totalPrice: "₹420",
        status: "Pending",
    },
    {
        id: "SL003",
        date: "2025-10-28",
        customerName: "Bill Gates",
        prescriptionNumber: "1234123",
        medicine: "Metformin 500mg",
        quantity: 100,
        modeOfPatment: ["Card"],
        totalPrice: "₹85",
        status: "Completed",
    },
];

let orders = [
    {
        id: "#ORD001",
        customerName: "John Doe",
        items: 5,
        totalPrice: "₹185",
        status: "Completed",
    },
    {
        id: "#ORD002",
        customerName: "Jane Smith",
        items: 1,
        totalPrice: "₹85",
        status: "Completed",
    },
    {
        id: "#ORD003",
        customerName: "Donald Duck",
        items: 6,
        totalPrice: "₹185",
        status: "Pending",
    },
    {
        id: "#ORD004",
        customerName: "Ram Singh",
        items: 9,
        totalPrice: "₹420",
        status: "Completed",
    },
];
