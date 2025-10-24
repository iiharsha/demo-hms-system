function loadProcedures() {
    renderProcedures();
}

function renderProcedures(list = procedures) {
    const table = document.getElementById("proceduresTable");
    if (!table) {
        console.log("not found");
        return;
    }

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
