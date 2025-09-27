/* Billing Page */

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

function loadBills() {
  const table = document.getElementById("billsTable");
  table.innerHTML = bills
    .map(
      (bill) => `
<tr>
<td>${bill.id}</td>
<td>${bill.patient}</td>
<td>${bill.date}</td>
<td>${bill.amount}</td>
<td><span class="badge badge-${
        bill.status === "Paid" ? "success" : "warning"
      }">${bill.status}</span></td>
<td>
<button class="btn btn-primary" onclick="viewBill('${
        bill.id
      }')" style="padding: 6px 12px; font-size: 12px;">View</button>
</td>
</tr>
`
    )
    .join("");
}

function filterBills() {
  const searchTerm = document.getElementById("billSearch").value.toLowerCase();
  const status = document.getElementById("billStatusFilter").value;

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

  const table = document.getElementById("billsTable");
  table.innerHTML = filtered
    .map(
      (bill) => `
                <tr>
                    <td>${bill.id}</td>
                    <td>${bill.patient}</td>
                    <td>${bill.date}</td>
                    <td>${bill.amount}</td>
                    <td><span class="badge badge-${
                      bill.status === "Paid" ? "success" : "warning"
                    }">${bill.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="viewBill('${
                          bill.id
                        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                    </td>
                </tr>
            `
    )
    .join("");
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
