/* Report Page */

function generateReport() {
  const reportType = document.getElementById("reportType").value;
  const fromDate = document.getElementById("reportFromDate").value;
  const toDate = document.getElementById("reportToDate").value;

  showNotification(`Generating ${reportType} from ${fromDate} to ${toDate}`);
}

//loadReportsPage
function loadReports() {
  const occupancyRate = getOccupancyRate(rooms);
  console.log("occupancyRate from reports page", +occupancyRate);
}
