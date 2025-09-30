/* Report Page */

function generateReport() {
  const reportType = document.getElementById("reportType").value;
  const fromDate = document.getElementById("reportFromDate").value;
  const toDate = document.getElementById("reportToDate").value;

  showNotification(`Generating ${reportType} from ${fromDate} to ${toDate}`);
}

loadJSON("../assets/data/rooms.json")
  .then(rooms => {
    loadReports(rooms);
  })
  .catch(error => {
    console.error("Error loading rooms:", error);
  });

function loadReports() {

  const revenueValue = "4.20Cr"
  const occupancyRate = getOccupancyRate(rooms);
  const reviewValue = 4.5;
  const consultationsTotalValue = 69;
  document.getElementById("revenueReportValue").textContent = revenueValue;
  document.getElementById("occupancyReportValue").textContent = occupancyRate + "%";
  document.getElementById("patientReviewValue").textContent = reviewValue;
  document.getElementById("consultationsReportValue").textContent = consultationsTotalValue;
}
