/* Billing Page */

function loadBills() {
    const tableBody = document.getElementById("billsTable");
    if (!tableBody) return console.error("billsTable not found");

    if (invoices.length === 0) {
        tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; color:#6b7280;">
          No invoices found
        </td>
      </tr>`;
        return;
    }

    const html = invoices
        .map((inv) => {
            const status = getPaymentStatus(inv);
            const badgeClass =
                status === "Paid"
                    ? "success"
                    : status === "Pending"
                      ? "warning"
                      : "danger";

            return `
        <tr>
          <td>${inv.id}</td>
          <td>${inv.patientId}</td>
          <td>${formatDate(inv.date)}</td>
          <td>${inv.totalAmount}</td>
          <td>${inv.paidAmount}</td>
          <td>
            <span class="badge badge-${badgeClass}">
              ${status}
            </span>
          </td>
          <td>
            <button class="action-btn action-btn-primary" onclick="viewBill('${inv.id}')" title="View Bill">
                <i class="ri-eye-line"></i>
            </button>
          </td>
        </tr>`;
        })
        .join("");

    tableBody.innerHTML = html;
}

function filterBills() {
    const searchTerm = document
        .getElementById("billSearch")
        ?.value.toLowerCase()
        .trim();
    const status = document.getElementById("billStatusFilter")?.value;

    let filtered = invoices;

    if (searchTerm) {
        filtered = filtered.filter(
            (inv) =>
                inv.id.toLowerCase().includes(searchTerm) ||
                inv.patientId.toLowerCase().includes(searchTerm),
        );
    }

    if (status) {
        filtered = filtered.filter(
            (inv) =>
                getPaymentStatus(inv).toLowerCase() === status.toLowerCase(),
        );
    }

    const html = filtered
        .map((inv) => {
            const paymentStatus = getPaymentStatus(inv);
            const badgeClass =
                paymentStatus === "Paid"
                    ? "success"
                    : paymentStatus === "Partial"
                      ? "warning"
                      : "danger";

            return `
        <tr>
          <td>${inv.id}</td>
          <td>${inv.patientId}</td>
          <td>${inv.date}</td>
          <td>${inv.totalAmount}</td>
          <td>${inv.paidAmount}</td>
          <td>
            <span class="badge badge-${badgeClass}">
              ${paymentStatus}
            </span>
          </td>
          <td>
            <button class="action-btn action-btn-primary" onclick="viewBill('${inv.id}')" title="View Bill">
                <i class="ri-eye-line"></i>
            </button>
          </td>
        </tr>`;
        })
        .join("");

    document.getElementById("billsTable").innerHTML = html;
}

function getPaymentStatus(invoice) {
    if (invoice.paidAmount === 0) return "Not Paid";
    if (invoice.paidAmount < invoice.totalAmount) return "Pending";
    return "Paid";
}

/* View Bill Details */
function openNewBillModal() {
    showNotification("Bill creation modal would open here");
    //TODO: Implement bill modal
}

function viewBill(id) {
    const invoice = invoices.find((inv) => inv.id === id);
    if (!invoice) return console.error("Invoice not found");

    // Hide main billing page & show details page
    document.getElementById("billing-page")?.classList.add("hide");
    document.getElementById("view-billing-page")?.classList.add("active");

    // Patient info display
    document.getElementById("patientIdDisplay").innerText = invoice.patientId;
    document.getElementById("patientNameDisplayBilling").innerText =
        getPatientName(invoice.patientId);

    // Payment status
    const paymentStatus = getPaymentStatus(invoice);
    const badgeClass =
        paymentStatus === "Paid"
            ? "success"
            : paymentStatus === "Pending"
              ? "warning"
              : "danger";

    // Procedures section
    const proceduresHTML = invoice.proceduresPerformed
        .map(
            (p) => `
            <tr>
                <td>${p.name}</td>
                <td>${p.price}</td>
            </tr>
        `,
        )
        .join("");

    // Medications section
    const medsHTML = invoice.medicationsBilled
        .map(
            (m) => `
            <tr>
                <td>${m.name}</td>
                <td>${m.quantity} × ${m.unitPrice}</td>
                <td>${m.total}</td>
            </tr>
        `,
        )
        .join("");

    // Inject complete invoice details
    document.getElementById("billingDetailsContainer").innerHTML = `
        <div style="margin: 15px 0;">
            <strong>Bill ID:</strong> ${invoice.id}<br>
            <strong>Date:</strong> ${formatDate(invoice.date)}<br>
            <strong>Status:</strong>
            <span class="badge badge-${badgeClass}">${paymentStatus}</span>
        </div>

        <h4>Procedures</h4>
        <table class="table table-striped mini-table">
            <thead>
                <tr>
                    <th>Procedure</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>${proceduresHTML}</tbody>
        </table>

        <h4 style="margin-top:15px;">Medications</h4>
        <table class="table table-striped mini-table">
            <thead>
                <tr>
                    <th>Medication</th>
                    <th>Qty × Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>${medsHTML}</tbody>
        </table>

        <hr>

        <div class="totals">
            <p><strong>Total Amount:</strong> ₹${invoice.totalAmount}</p>
            <p><strong>Paid Amount:</strong> ₹${invoice.paidAmount}</p>
            <p><strong>Balance Due:</strong> ₹${invoice.totalAmount - invoice.paidAmount}</p>
        </div>
    `;
}

function backToBillings() {
    const billingPage = document.getElementById("billing-page");
    if (billingPage) billingPage.classList.remove("hide");

    const viewBilling = document.getElementById("view-billing-page");
    if (viewBilling) viewBilling.classList.remove("active");
}
