/* Report Page */

function generateReport() {
  const reportType = DOM.getValue("reportType");
  const fromDate = DOM.getValue("reportFromDate");
  const toDate = DOM.getValue("reportToDate");

  showNotification(`Generating ${reportType} from ${fromDate} to ${toDate}`);
}

// loadJSON("../assets/data/rooms.json")
//   .then(rooms => {
//     loadReports(rooms);
//   })
//   .catch(error => {
//     console.error("Error loading rooms:", error);
//   });

function loadReports() {

  const revenueValue = "4.20Cr"
  const occupancyRate = getOccupancyRate(rooms);
  const reviewValue = 4.5;
  const consultationsTotalValue = consultations.length;
  DOM.setValue("revenueReportValue", revenueValue);
  DOM.setValue("occupancyReportValue", `${occupancyRate}%`);
  DOM.setValue("patientReviewValue", reviewValue);
  DOM.setValue("consultationsReportValue", consultationsTotalValue);
}
