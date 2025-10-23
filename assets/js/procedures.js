const procedures = [
    {
        id: 1,
        name: "Ear Piercing under LA",
        price: 500,
    },
    {
        id: 2,
        name: "Mastoidectomy with Tympanoplasty under GA",
        price: 500,
    },
    {
        id: 3,
        name: "Injection for vomiting relief",
        price: 500,
    },
    {
        id: 4,
        name: "Trachestomy Closure",
    },
    {
        id: 5,
        name: "Ear Wick insertion",
    },
    {
        id: 6,
        name: "Anaestheist's charges",
    },
    {
        id: 7,
        name: "Room Charges",
    },
    {
        id: 8,
        name: "Septoplasty with Bilateral Turbinate Reduction under GA",
    },
    {
        id: 9,
        name: "Injection for Pain relief",
    },
];

function loadProcedures() {
    renderProcedures();
}

function renderProcedures(list = procedures) {
    const table = document.getElementById("proceduresTable");
    if (!table) return;

    if (list.length === 0) {
        table.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; color:#6b7280;">No procedures found</td>
        </tr>`;
        return;
    }

    table.innerHTML = list
        .map(
            (procedure) => `
      <tr>
        <td>${procedure.id}</td>
        <td>${procedure.name}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn action-btn-primary" onclick="editProcedure(${procedure.id})">
              <i class="ri-edit-2-line"></i>
            </button>
            <button class="action-btn action-btn-danger" onclick="deleteProcedure(${procedure.id})">
              <i class="ri-delete-bin-6-line"></i>
            </button>
          </div>
        </td>
      </tr>`,
        )
        .join("");
}

// --- Search Function ---
function searchProcedures() {
    const query = document
        .getElementById("procedureSearch")
        .value.toLowerCase()
        .trim();

    const filtered = procedures.filter((p) =>
        p.name.toLowerCase().includes(query),
    );

    renderProcedures(filtered);
}

// --- Modal Toggle ---
function toggleAddProcedureModal(show) {
    const modal = document.getElementById("addProcedureModal");
    modal.classList.toggle("hidden", !show);
    if (show) document.getElementById("procedureNameInput").focus();
}

// --- Add Procedure ---
function addProcedure() {
    const input = document.getElementById("procedureNameInput");
    const name = input.value.trim();
    if (!name) return alert("Please enter a procedure name.");

    const newProcedure = {
        id: procedures.length ? procedures[procedures.length - 1].id + 1 : 1,
        name,
    };

    procedures.push(newProcedure);
    renderProcedures();
    input.value = "";
    toggleAddProcedureModal(false);
}

// --- Edit Procedure (Placeholder) ---
function editProcedure(id) {
    const proc = procedures.find((p) => p.id === id);
    if (!proc) return;
    const newName = prompt("Edit Procedure Name:", proc.name);
    if (newName) {
        proc.name = newName.trim();
        renderProcedures();
    }
}

// --- Delete Procedure ---
function deleteProcedure(id) {
    if (!confirm("Are you sure you want to delete this procedure?")) return;
    procedures = procedures.filter((p) => p.id !== id);
    renderProcedures();
}
