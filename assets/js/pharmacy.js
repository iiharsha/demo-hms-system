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
