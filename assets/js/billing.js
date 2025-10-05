/* Billing Page */

function loadBills() {
  const html = bills
    .map(
      (bill) => `
<tr>
<td>${bill.id}</td>
<td>${bill.patient}</td>
<td>${bill.date}</td>
<td>${bill.amount}</td>
<td><span class="badge badge-${bill.status === "Paid" ? "success" : "warning"
        }">${bill.status}</span></td>
<td>
<button class="btn btn-primary" onclick="viewBill('${bill.id
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
</td>
</tr>
`
    )
    .join("");
  DOM.setHTML("billsTable", html);
}

function filterBills() {
  const searchTerm = DOM.getValue("billSearch").toLowerCase();
  const status = DOM.getValue("billStatusFilter");

  let filtered = bills;
  if (searchTerm) {
    filtered = filtered.filter(
      (b) =>
        b.patient.toLowerCase().includes(searchTerm) ||
        b.id.toLowerCase().includes(searchTerm)
    );
  }
  if (status) {
    filtered = filtered.filter(
      (b) => b.status.toLowerCase() === status.toLowerCase()
    );
  }

  const html = filtered
    .map(
      (bill) => `
                <tr>
                    <td>${bill.id}</td>
                    <td>${bill.patient}</td>
                    <td>${bill.date}</td>
                    <td>${bill.amount}</td>
                    <td><span class="badge badge-${bill.status === "Paid" ? "success" : "warning"
        }">${bill.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewBill('${bill.id
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");

  DOM.setHTML("billsTable", html);
}

/* View Bill Details */
function openNewBillModal() {
  showNotification("Bill creation modal would open here");
  //TODO: Implement bill modal
}

function viewBill(id) {
  showNotification(`Viewing bill ${id}`);
  //TODO: Implement view bill details
}
