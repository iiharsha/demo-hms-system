/* Inventory Page */

/** load inventory table */
function loadInventory() {
  const html = inventory
    .map(
      (item) => `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice}</td>
                    <td>${formatDate(item.expiryDate)}</td>
                    <td>
                      <span class="badge badge-${item.status === "In Stock"
          ? "success"
          : item.status === "Low Stock"
            ? "warning"
            : "danger"
        }">
                        ${item.status}
                      </span>
                    </td>

                    <td>
                        <button class="action-btn action-btn-primary" onclick="editInventoryItem('${item.code}')" title="Edit Item">
                          <i class="ri-edit-2-line"></i>
                        </button>
                        <button class="action-btn action-btn-danger" onclick="deleteInventoryItem('${item.code}')" title="Delete Item">
                          <i class="ri-delete-bin-6-line"></i>
                        </button>
                    </td>
                </tr>
            `
    )
    .join("");

  DOM.setHTML("inventoryTable", html);
}

/** ===== Add Inventory Item ===== */
function inventoryAddMedicine() {
  const name = DOM.getValue("inventoryMedicineName");
  const manufacturer = DOM.getValue("inventoryMedicineManufacturer");
  const batchNumber = DOM.getValue("inventoryMedicineBatchNumber");
  const quantity = parseInt(DOM.getValue("inventoryMedicineQuantity")) || 0;
  const unitPrice = "₹" + (parseFloat(DOM.getValue("inventoryMedicineUnitPrice")) || 0);
  const expiryDate = DOM.getValue("inventoryMedicineExpiry");
  const category = DOM.getValue("dashboardPatientGender"); // select element

  if (!name || !manufacturer || !batchNumber || !expiryDate) {
    showNotification("Please fill in all required fields!", "error");
    return;
  }

  // Generate unique code
  const code = "MED" + String(Math.floor(100 + Math.random() * 900));

  // Determine status
  let status = "In Stock";
  if (quantity < 20 && quantity > 0) status = "Low Stock";
  if (quantity === 0) status = "Out of Stock";

  // Add new item
  inventory.push({
    code,
    name,
    category,
    quantity,
    unitPrice,
    expiryDate,
    status,
  });

  showNotification(`Medicine "${name}" added successfully!`);
  clearAddInventoryForm();
  loadInventory();
}

/** ===== Clear Add Form ===== */
function clearAddInventoryForm() {
  [
    "inventoryMedicineName",
    "inventoryGenericName",
    "inventoryMedicineManufacturer",
    "inventoryMedicineBatchNumber",
    "inventoryMedicineQuantity",
    "inventoryMedicineUnitPrice",
    "inventoryMedicineExpiry",
  ].forEach((id) => DOM.setValue(id, ""));
}

/** ===== Edit Inventory Item ===== */
function editInventoryItem(code) {
  const item = inventory.find((m) => m.code === code);
  if (!item) return showNotification("Item not found", "error");

  // Prefill form fields
  DOM.setValue("inventoryMedicineName", item.name);
  DOM.setValue("inventoryGenericName", item.name);
  DOM.setValue("inventoryMedicineManufacturer", item.manufacturer || "");
  DOM.setValue("inventoryMedicineBatchNumber", item.batchNumber || "");
  DOM.setValue("inventoryMedicineQuantity", item.quantity);
  DOM.setValue("inventoryMedicineUnitPrice", item.unitPrice.replace("₹", ""));
  DOM.setValue("inventoryMedicineExpiry", item.expiryDate);
  DOM.setValue("dashboardPatientGender", item.category);

  // Store current editing item in a temp variable
  window.editingCode = code;

  showNotification(`Editing medicine: ${item.name}`);
}

/** ===== Update or Save Edited Item ===== */
function saveEditedMedicine() {
  if (!window.editingCode) return showNotification("No item selected for editing");

  const index = inventory.findIndex((m) => m.code === window.editingCode);
  if (index === -1) return;

  const quantity = parseInt(DOM.getValue("inventoryMedicineQuantity")) || 0;
  const unitPrice = "₹" + (parseFloat(DOM.getValue("inventoryMedicineUnitPrice")) || 0);
  const expiryDate = DOM.getValue("inventoryMedicineExpiry");
  const category = DOM.getValue("dashboardPatientGender");

  let status = "In Stock";
  if (quantity < 20 && quantity > 0) status = "Low Stock";
  if (quantity === 0) status = "Out of Stock";

  // Update the item
  inventory[index] = {
    ...inventory[index],
    name: DOM.getValue("inventoryMedicineName"),
    category,
    quantity,
    unitPrice,
    expiryDate,
    status,
  };

  showNotification("Medicine updated successfully!");
  window.editingCode = null;
  clearAddInventoryForm();
  loadInventory();
}

/** ===== Delete Inventory Item ===== */
function deleteInventoryItem(code) {
  const confirmed = confirm("Are you sure you want to delete this item?");
  if (!confirmed) return;

  inventory = inventory.filter((item) => item.code !== code);
  showNotification(`Item ${code} deleted successfully!`);
  loadInventory();
}

document.addEventListener("DOMContentLoaded", loadInventory);

/** filters the inventory */
function filterInventory() {
  const searchTerm = DOM.getValue("inventorySearch").toLowerCase();

  const category = DOM.getValue("categoryFilter");

  let filtered = inventory;
  if (searchTerm) {
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(searchTerm) ||
        i.code.toLowerCase().includes(searchTerm)
    );
  }
  if (category) {
    filtered = filtered.filter(
      (i) => i.category.toLowerCase() === category.toLowerCase()
    );
  }

  const html = filtered
    .map(
      (item) => `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice}</td>
                    <td>${formatDate(item.expiryDate)}</td>
                    <td>
                      <span class="badge badge-${item.status === "In Stock"
          ? "success"
          : item.status === "Low Stock"
            ? "warning"
            : "danger"
        }">
                        ${item.status}
                      </span>
                    </td>

                    <td>
                        <button class="action-btn action-btn-primary" onclick="editInventoryItem('${item.code}')">
                          <i class="ri-edit-2-line"></i>
                        </button>
                        <button class="action-btn action-btn-danger" onclick="deleteInventoryItem('${item.code}')">
                          <i class="ri-delete-bin-6-line"></i>
                        </button>
                    </td>
                </tr>
            `
    )
    .join("");

  DOM.setHTML("inventoryTable", html);
}
