/** Initialize Patients Page 
 * */
function loadPharmacy() {
  // Update statistics
  DOM.setValue("todaySales", sales.length);
  DOM.setValue("todayOrders", sales.length);
  DOM.setValue("activePatients", patients.length - 1);
  DOM.setValue("criticalPatients", 1);

  loadRecentSales();
}

/** loads the recent sales/orders table */
function loadRecentSales() {
  const html = sales
    .map((sale) => {
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
                            </div>
                        </td>
                        <td>${sale.customerName}</td>
                        <td>${sale.quantity}</td>
                        <td>${sale.totalPrice}</td>
                        <td><span class="badge badge-${statusClass}">${status}</span></td>
                        <td>
                          <div class="action-buttons">
                              <button class="btn btn-primary" onclick="viewSaleOrder('${sale.id}')">View</button>
                              <button class="btn btn-outline" onclick="printOrder('${sale.id}')">Print</button>
                          </div>
                        </td>
                    </tr>
                `;
    })
    .join("");

  DOM.setHTML("recentSalesTable", html);
}

/** opens a modal to view the order */
function viewSaleOrder(saleId) {
  showErrorNotification("Work In Progress")
}
