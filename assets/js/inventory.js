/* Inventory Page */

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

function loadInventory() {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = inventory
    .map(
      (item) => `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td><span class="badge badge-${
                      item.status === "In Stock" ? "success" : "warning"
                    }">${item.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewInventoryItem('${
                          item.code
                        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");
}

function openAddInventoryModal() {
  showNotification("Add inventory modal would open here");
  //TODO: Implement modal functionality
}

function viewInventoryItem(code) {
  showNotification(`Viewing inventory item ${code}`);
  //TODO: Implement this
}

function filterInventory() {
  const searchTerm = document
    .getElementById("inventorySearch")
    .value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;

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

  const table = document.getElementById("inventoryTable");
  table.innerHTML = filtered
    .map(
      (item) => `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td><span class="badge badge-${
                      item.status === "In Stock" ? "success" : "warning"
                    }">${item.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewInventoryItem('${
                          item.code
                        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");
}
