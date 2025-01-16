
// order are taken from the ejs variable

// Parse the orders array injected from the

const today = new Date();
const groups = { day: [], week: [], month: [], year: [], custom_date: [] };

// Populate the groups (day, week, month, year)
orders.forEach(order => {
    const diffDays = Math.floor((today - new Date(order.order_date)) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        groups.day.push(order);
    }
    if (diffDays <= 7) {
        groups.week.push(order);
    }
    if (diffDays <= 30) {
        groups.month.push(order);
    }
    if (diffDays <= 365) {
        groups.year.push(order);
    }
});

// Function to filter orders by custom date
function filterByCustomDate(selectedDate) {
    groups.custom_date = orders.filter(order => {
        const orderDate = new Date(order.order_date).toISOString().split('T')[0];
        return orderDate === selectedDate;
    });
    updateOverviewData(groups.custom_date)
}

// Function to update displayed data based on the selected group
function updateOverviewData(filteredGroup) {
    console.log('helooo',filteredGroup);

    const salesCount = filteredGroup.length; 
    const orderAmount = filteredGroup.reduce((sum, order) => sum + order.final_price, 0);
    const discountAmount = filteredGroup.reduce((sum, order) => sum + order.discount_price, 0)
    const couponDeduction = filteredGroup.reduce((sum, order) => sum + (order.coupon_discount || 0), 0)
    
    let table_body = ``
    filteredGroup.forEach((x)=>{
        table_body += `
                            <tr id="dynamic_tr">
                                <td class="cell">${x.order_id}</td>
                                <td class="cell">${x.address.full_name}</span></td>
                                <td class="cell">${ x.payment_method}</td>
                                <td class="cell">${x.order_date}</td>
                                <td class="cell">${x.address.house},${x.address.road_map},${x.address.state},${x.address.pincode}</td>
                                <td class="cell">${x.final_price}</td>
                            </tr>` 

    })
    document.getElementById('table_body').innerHTML = table_body;
    
}

// Attach event listener for the select dropdown
document.getElementById('filterSelect').addEventListener('change', function () {
    const filter = this.value;
    const filteredGroup = groups[
        filter === 'day' ? 'day' :
        filter === 'week' ? 'week' :
        filter === 'month' ? 'month' :
        'year'
    ];
    updateOverviewData(filteredGroup);
});

// Attach event listener for custom date input
document.getElementById('custom_date').addEventListener('change', function () {
    const selectedDate = this.value; // Get the custom date value
    if (selectedDate) {
        filterByCustomDate(selectedDate);
    } else {
        document.getElementById('expiry_date_error').style.display = 'block';
    }
});

// Set initial data (for "week" by default)
updateOverviewData(groups.week);

function downloadPDF() {
    // Fetch table and calculate total amount
    const table = document.getElementById("sales_table");
    const rows = table.querySelectorAll("tbody tr");
    let totalAmount = 0;

    rows.forEach((row) => {
      const totalCell = row.cells[3];
      totalAmount += parseFloat(totalCell.textContent || "0");
    });

    // Create a new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Sales Report", 14, 20);

    // Add timestamp
    doc.setFontSize(12);
    doc.text("Generated on: " + new Date().toLocaleString(), 14, 30);

    
    // Add table using AutoTable
    doc.autoTable({
      html: table,
      startY: 40,
      theme: "grid",
      didDrawCell: (data) => {
        // Additional customization, if needed
      },
    });

    // Add total amount row at the end
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(12);
    doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 14, finalY + 10);

    // Save the PDF
    doc.save("sales_report.pdf");
  }

// function downloadExcel() {
//     // Get the table element
//     const table = document.getElementById("sales_table");

//     // Convert the HTML table to a worksheet
//     const worksheet = XLSX.utils.table_to_sheet(table);

//     // Create a new workbook and append the worksheet
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

//     // Export the workbook as an Excel file
//     XLSX.writeFile(workbook, "table_report.xlsx");
//   }
function downloadExcel() {
    // Fetch the HTML table
    const table = document.getElementById("sales_table");
  
    // Create a new Workbook
    const workbook = XLSX.utils.book_new();
  
    // Convert the HTML table to a worksheet
    const worksheet = XLSX.utils.table_to_sheet(table);
  
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
  
    // Add custom data like total amount
    const rows = table.querySelectorAll("tbody tr");
    let totalAmount = 0;
  
    rows.forEach((row) => {
      const totalCell = row.cells[3];
      totalAmount += parseFloat(totalCell.textContent || "0");
    });
  
    // Add a row for the total amount
    const totalRow = rows.length + 2; // Add row index for 'Total Amount'
    const totalLabelCell = `A${totalRow}`;
    const totalValueCell = `D${totalRow}`;
  
    worksheet[totalLabelCell] = { t: "s", v: "Total Amount:" }; // Add label
    worksheet[totalValueCell] = { t: "n", v: totalAmount }; // Add value
  
    // Set proper column width
    const colWidths = [
      { wpx: 150 }, // Column A width
      { wpx: 100 }, // Column B width
      { wpx: 100 }, // Column C width
      { wpx: 100 }, // Column D width
    ];
    worksheet["!cols"] = colWidths;
  
    // Export the Excel file
    XLSX.writeFile(workbook, "sales_report.xlsx");
  }