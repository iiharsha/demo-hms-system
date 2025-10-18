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
let rooms = [
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
