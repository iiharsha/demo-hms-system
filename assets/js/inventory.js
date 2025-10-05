/* Inventory Page */


function loadInventory() {
  const html = inventory
    .map(
      (item) => `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td><span class="badge badge-${item.status === "In Stock" ? "success" : "warning"
        }">${item.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewInventoryItem('${item.code
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");

  DOM.setHTML("inventoryTable", html);
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
                    <td>${item.unit}</td>
                    <td><span class="badge badge-${item.status === "In Stock" ? "success" : "warning"
        }">${item.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewInventoryItem('${item.code
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");

  DOM.setHTML("inventoryTable", html);
}
