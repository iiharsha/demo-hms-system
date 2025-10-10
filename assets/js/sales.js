function addToCart() {
  const saleData = getNewSaleFormData();

  // validation
  if (!saleData.customerName || !saleData.medicineId || saleData.quantity <= 0) {
    showErrorNotification("Please fill out all required fields.");
    return;
  }

  showErrorNotification("Work In Progress");
}

function getNewSaleFormData() {
  return {
    customerName: DOM.getValue("newSaleCustomerName").trim(),
    prescriptionNumber: DOM.getValue("newSalePrescriptionNumber").trim(),
    medicineName: DOM.get("newSaleMedicineSelect").selectedOptions[0]?.text || "",
    quantity: parseInt(DOM.getValue("newSaleMedicineQuantity"), 10) || 0,
  };
}

function processSale() {
  showErrorNotification("Work In Progress");
}

function clearAddInventoryForm() {
  showErrorNotification("Work In Progress");
}
