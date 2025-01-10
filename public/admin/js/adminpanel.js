
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
    const salesCount = filteredGroup.length;
    const orderAmount = filteredGroup.reduce((sum, order) => sum + order.final_price, 0);
    const discountAmount = filteredGroup.reduce((sum, order) => sum + order.discount_price, 0)
    const couponDeduction = filteredGroup.reduce((sum, order) => sum + (order.coupon_discount || 0), 0)

    document.getElementById('sales_count').textContent = `${salesCount || 0}`;
    document.getElementById('order_amount').textContent = `₹${orderAmount || 0}`;
    document.getElementById('discount_amount').textContent = `₹${discountAmount || 0}`;
    document.getElementById('coupon_deduction').textContent = `₹${couponDeduction || 0}`;
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
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adding title
    doc.setFontSize(16);
    doc.text("Sales Report", 20, 20);

    // Define table data (key-value pairs)
    const rows = [
        ["Overall Sales Count", document.getElementById('sales_count').innerHTML],
        ["Overall Order Amount", document.getElementById('order_amount').innerHTML],
        ["Overall Discount Amount", document.getElementById('discount_amount').innerHTML],
        ["Coupons Deduction", document.getElementById('coupon_deduction').innerHTML]
    ];

    // Adding the table
    doc.autoTable({
        body: rows,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255] }, // No fill for header (key)
        bodyStyles: { halign: 'center' },
        columnStyles: {
        0: { cellWidth: 100, fontStyle: 'bold', halign: 'left' }, // Key column
        1: { cellWidth: 80, textColor: [40, 167, 69] } // Value column with color
        }
    });

    // Save the PDF with the name
    doc.save("sales_report_key_value_table.pdf");
}

function downloadExcel() {
    const reportData = [
        ["Particulars", "Value"],
        ["Overall Sales Count", document.getElementById('sales_count').innerHTML],
        ["Overall Order Amount", document.getElementById('order_amount').innerHTML],
        ["Overall Discount Amount", document.getElementById('discount_amount').innerHTML],
        ["Coupons Deduction", "₹ " + document.getElementById('coupon_deduction').innerHTML]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    // Write and download the Excel file
    XLSX.writeFile(workbook, "SalesReport.xlsx");
}


document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`/admin/sales_report?duration=${duration}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const dBdata = await response.json();

    

    configureCategoryChart(dBdata.top_selling_categorys);
    configureProductChart(dBdata.top_selling_products);
    configureBrandChart(dBdata.top_selling_brands);

});