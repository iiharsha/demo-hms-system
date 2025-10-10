/** Initialize Patients Page 
 * */
function loadPharmacy() {
  // Update statistics
  DOM.setValue("todaySales", sales.length);
  DOM.setValue("todayOrders", sales.length);
  DOM.setValue("activePatients", patients.length - 1);
  DOM.setValue("criticalPatients", 1);

  const html = sales
    .map((sale) => {
      const lastVisit =
        sale.medicalHistory && sale.medicalHistory.length > 0
          ? sale.medicalHistory[0].date
          : "No visits";
      const hasAllergies = sale.allergies && sale.allergies.length > 0;
      const hasChronic =
        sale.status === "Completed";
      const status = hasChronic ? "Completed" : "Pending";
      const statusClass = hasChronic ? "success" : "warning";

      return `
                    <tr>
                        <td>${sale.id}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                ${formatDate(sale.date)}
                                ${hasAllergies
          ? '<span title="Has allergies" style="color: var(--danger);">!</span>'
          : ""
        }
                            </div>
                        </td>
                        <td>${sale.customerName}</td>
                        <td>${sale.items}</td>
                        <td>${sale.totalPrice}</td>
                        <td><span class="badge badge-${statusClass}">${status}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-primary" onclick="viewOrder('${sale.id
        }')" style="padding: 6px 12px; font-size: 12px;">View</button>
                                <button class="btn btn-outline" onclick="printOrder('${sale.id
        }')" style="padding: 6px 12px; font-size: 12px;">Print</button>
                            </div>
                        </td>
                    </tr>
                `;
    })
    .join("");

  DOM.setHTML("recentSalesTable", html);
}

/* loads the recent appointments table */
function loadRecentSales() {
  const html = sales
    .map(
      (sale) => `
                <tr>
                    <td>${sale.id}</td>
                    <td>${formatDate(sale.date)}</td>
                    <td>${sale.customerName}</td>
                    <td>${sale.quantity}</td>
                    <td>${sale.totalPrice}</td>
                    <td><span class="badge badge-${sale.status === "Completed" ? "success" : "primary"}">${sale.status}</span></td>
                </tr>
            `,
    )
    .join("");
  DOM.setHTML("recentSalesTable", html);
}
