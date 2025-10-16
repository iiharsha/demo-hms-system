/* Dashboard Page */

/* initializes the dashboard stats */
function initializeDashboard() {
    DOM.get("totalPatients").textContent = patients.length;
    DOM.get("todayAppointments").textContent = appointments.length;
    DOM.get("activeAdmissions").textContent = admissions.filter(
        (a) => a.status === "Active",
    ).length;
    DOM.get("pendingBills").textContent = bills.filter(
        (b) => b.status === "Pending",
    ).length;

    loadRecentTodayAppointments();
    loadTodaysInvoices();
    loadRecentAdmissions();
    loadRooms();
}

/* loads the recent appointments table */
function loadTodaysInvoices() {
    const html = invoices
        .slice(0, 5)
        .map(
            (patient) => `
                <tr>
                    <td>${patient.id}</td>
                    <td>${patient.name}</td>
                    <td>
                        <button class="action-btn action-btn-primary" onclick="viewInvoice('${patient.id}')" title="View Invoice">
                            <i class="ri-eye-line"></i>
                        </button>
                </tr>
            `,
        )
        .join("");
    DOM.setHTML("todaysInvoicesDashboard", html);
}

/* Loads today's appointments into the recent appointments card */
function loadRecentTodayAppointments() {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Filter appointments that are scheduled for today
    const todaysAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.date).toISOString().split("T")[0];
        return aptDate === today;
    });

    /* Render today's appointments */
    const html = todaysAppointments.length
        ? todaysAppointments
              .slice(0, 5)
              .map(
                  (apt) => `
            <tr>
              <td>${apt.time}</td>
              <td>${apt.patientName}</td>
              <td>${apt.doctor}</td>
              <td>${apt.type}</td>
              <td>
                <span class="badge badge-${apt.status === "Completed" ? "success" : "primary"}">
                  ${apt.status}
                </span>
              </td>
            </tr>
          `,
              )
              .join("")
        : `<tr><td colspan="5" style="text-align:center;">No appointments today</td></tr>`;
    DOM.setHTML("recentAppointmentsTable", html);
}

/* loads the recent admissions table */
function loadRecentAdmissions() {
    const html = admissions
        .slice(0, 5)
        .map(
            (adm) => `
                <tr>
                    <td>${adm.id}</td>
                    <td>${adm.patientName}</td>
                    <td>${adm.roomId}</td>
                    <td>${formatDate(adm.admissionDate)}</td>
                    <td><span class="badge badge-${
                        adm.status === "Active" ? "success" : "warning"
                    }">${adm.status}</span></td>
                </tr>
            `,
        )
        .join("");
    DOM.setHTML("recentAdmissionsTable", html);
}

/*Auto - refresh dashboard stats every 30 seconds */
document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        const dashboardPage = DOM.get("dashboard-page");
        if (dashboardPage && !dashboardPage.classList.contains("hide")) {
            initializeDashboard();
        }
    }, 30000);
});
