/* Dashboard Page */

/* initializes the dashboard stats */
function initializeDashboard() {
  document.getElementById("todayAppointments").textContent =
    appointments.length;
  document.getElementById("activeAdmissions").textContent = admissions.filter(
    (a) => a.status === "Active",
  ).length;
  document.getElementById("pendingBills").textContent = bills.filter(
    (b) => b.status === "Pending",
  ).length;

  loadRecentAppointments();
  loadRecentAdmissions();
  loadData();
}

/* loads the recent appointments table */
function loadRecentAppointments() {
  const table = document.getElementById("recentAppointmentsTable");
  table.innerHTML = appointments
    .slice(0, 5)
    .map(
      (apt) => `
                <tr>
                    <td>${apt.time}</td>
                    <td>${apt.patientName}</td>
                    <td>${apt.doctor}</td>
                    <td>${apt.type}</td>
                    <td><span class="badge badge-${apt.status === "Completed" ? "success" : "primary"
        }">${apt.status}</span></td>
                </tr>
            `,
    )
    .join("");
}

/* loads the recent admissions table */
function loadRecentAdmissions() {
  const table = document.getElementById("recentAdmissionsTable");
  table.innerHTML = admissions
    .slice(0, 5)
    .map(
      (adm) => `
                <tr>
                    <td>${adm.id}</td>
                    <td>${adm.patientName}</td>
                    <td>${adm.roomId}</td>
                    <td>${adm.admissionDate}</td>
                    <td><span class="badge badge-${adm.status === "Active" ? "success" : "warning"
        }">${adm.status}</span></td>
                </tr>
            `,
    )
    .join("");
}

/*Auto - refresh dashboard stats every 30 seconds */
document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    const dashboardPage = document.getElementById("dashboard-page");
    if (dashboardPage && !dashboardPage.classList.contains("hide")) {
      initializeDashboard();
    }
  }, 30000);
})

