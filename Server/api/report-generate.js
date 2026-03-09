const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();

router.get('/', (req, res) => {
    const { reportType, reportScope, year, month } = req.query;

    const now = new Date();
    const generatedDate = now.toLocaleString();

    const doc = new PDFDocument();
    const filename = `${reportScope}_${reportType}_${year}${month ? `_${month}` : ''}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Update title with timeframe (Month/Year) or just Year
    let reportTitle = `${reportScope.charAt(0).toUpperCase() + reportScope.slice(1)} ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;

    if (reportScope === 'monthly' && month && year) {
        // Monthly report title
        reportTitle += ` - ${month}/${year}`;
    } else if (reportScope === 'yearly' && year) {
        // Yearly report title
        reportTitle += ` - ${year}`;
    }

    doc.fontSize(20).text(reportTitle, { align: 'center' });
    doc.moveDown();

    // Add summary
    doc.fontSize(12).text(`Summary:`, { underline: true });
    doc.text(`Generated on: ${generatedDate}`);
    doc.moveDown();

    // Function to draw a table
    const drawTable = (headers, rows) => {
        const tableWidth = 500;
        const rowHeight = 20;
        const columnSpacing = 10;
        const columnWidths = headers.map(() => tableWidth / headers.length);

        // Center the table by calculating the starting X position
        const xPosition = (doc.page.width - tableWidth) / 2;

        let yPosition = doc.y;

        // Draw headers
        headers.forEach((header, i) => {
            doc.fontSize(10).text(header, xPosition + columnWidths[i] * i + columnSpacing, yPosition);
        });
        yPosition += rowHeight;

        // Draw rows
        rows.forEach(row => {
            row.forEach((cell, i) => {
                doc.fontSize(10).text(cell, xPosition + columnWidths[i] * i + columnSpacing, yPosition);
            });
            yPosition += rowHeight;
        });
    };

    // Add dynamic content based on report type and scope
    if (reportScope === 'monthly' && reportType === 'overall') {
        const headers = ['Month/Year', 'Total Listings', 'Active Listings', 'Sold Listings', 'Rented Listings', 'Requested Listings', 'Total Revenue'];
        const rows = [
            ['January 2024', '150', '30', '50', '20', '50', 'KSH 500,000'],
            ['February 2024', '120', '40', '40', '30', '10', 'KSH 400,000'],
            ['March 2024', '180', '60', '60', '50', '10', 'KSH 700,000'],
            ['Total', '450', '130', '150', '100', '70', 'KSH 1,600,000'],
        ];
        drawTable(headers, rows);
    } else if (reportScope === 'monthly' && reportType === 'sales') {
        const headers = ['Month/Year', 'Car Model', 'Year', 'Price', 'Sale Date', 'Customer Name', 'Location', 'Payment Status'];
        const rows = [
            ['January 2024', 'Honda Civic', '2020', 'KSH 20,000', '2024-01-15', 'John Doe', 'New York', 'Paid'],
            ['January 2024', 'Ford Mustang', '2019', 'KSH 30,000', '2024-01-20', 'Jane Smith', 'Los Angeles', 'Pending'],
            ['February 2024', 'BMW X5', '2021', 'KSH 50,000', '2024-02-05', 'Bob Johnson', 'Miami', 'Paid'],
            ['Total', '', '', 'KSH 100,000', '', '', ''],
        ];
        drawTable(headers, rows);
    } else if (reportScope === 'monthly' && reportType === 'rentals') {
        const headers = ['Month/Year', 'Car Model', 'Year', 'Rent Price', 'Rent Start Date', 'Rent End Date', 'Customer Name', 'Location', 'Payment Status'];
        const rows = [
            ['January 2024', 'Toyota Corolla', '2021', 'KSH 1,500', '2024-01-10', '2024-01-15', 'Alice Brown', 'Boston', 'Paid'],
            ['February 2024', 'Nissan Altima', '2020', 'KSH 2,000', '2024-02-01', '2024-02-10', 'Mark White', 'Chicago', 'Pending'],
            ['March 2024', 'Audi Q7', '2022', 'KSH 3,000', '2024-03-05', '2024-03-12', 'Sara Lee', 'San Francisco', 'Paid'],
            ['Total', '', '', 'KSH 6,500', '', '', '', '', ''],
        ];
        drawTable(headers, rows);
    } else if (reportScope === 'monthly' && reportType === 'financials') {
        const headers = ['Month/Year', 'Total Sales Revenue', 'Total Rental Revenue', 'Total Payments', 'Pending Payments', 'Refunds Processed'];
        const rows = [
            ['January 2024', 'KSH 500,000', 'KSH 15,000', 'KSH 515,000', 'KSH 50,000', 'KSH 2,000'],
            ['February 2024', 'KSH 400,000', 'KSH 20,000', 'KSH 420,000', 'KSH 20,000', 'KSH 1,500'],
            ['March 2024', 'KSH 700,000', 'KSH 25,000', 'KSH 725,000', 'KSH 25,000', 'KSH 3,000'],
            ['Total', 'KSH 1,600,000', 'KSH 60,000', 'KSH 1,660,000', 'KSH 95,000', 'KSH 6,500'],
        ];
        drawTable(headers, rows);
    } else if (reportScope === 'monthly' && reportType === 'customerfeedback') {
        const headers = ['Month/Year', 'Car Model', 'Customer Name', 'Rating', 'Review Date', 'Review Comments'];
        const rows = [
            ['January 2024', 'Honda Civic', 'John Doe', '4.5', '2024-01-15', 'Great car, very smooth ride!'],
            ['January 2024', 'Ford Mustang', 'Jane Smith', '4.0', '2024-01-20', 'Nice car, but a bit noisy.'],
            ['February 2024', 'BMW X5', 'Bob Johnson', '5.0', '2024-02-05', 'Perfect luxury SUV!'],
            ['March 2024', 'Audi Q7', 'Sara Lee', '4.8', '2024-03-05', 'Great comfort and performance!'],
        ];
        drawTable(headers, rows);
    } else if (reportScope === 'yearly' && reportType === 'overall') {
        const headers = ['Year', 'Total Listings', 'Cars Sold', 'Cars Rented', 'Total Transactions'];
        const rows = [
            ['2023', '320', '150', '120', '270'],
            ['2022', '290', '140', '100', '240'],
            ['2021', '250', '130', '90', '220'],
        ];
        drawTable(headers, rows);
    } else if (reportScope === 'yearly' && reportType === 'sales') {
        const headers = ['Year', 'Cars Sold', 'Revenue (KSH )', 'Average Price per Car (KSH )', 'Certified Cars Sold'];
        const rows = [
            ['2023', '150', 'KSH 1,500,000', 'KSH 10,000', '40'],
            ['2022', '140', 'KSH 1,400,000', 'KSH 10,000', '35'],
            ['2021', '130', 'KSH 1,300,000', 'KSH 10,000', '30'],
        ];
        drawTable(headers, rows);
    } else if (reportScope === 'yearly' && reportType === 'rentals') {
        const headers = ['Year', 'Cars Rented', 'Rental Transactions', 'Total Rental Income (KSH )', 'Average Rental Duration (Days)'];
        const rows = [
            ['2023', '120', '120', 'KSH 72,000', '15'],
            ['2022', '100', '100', 'KSH 60,000', '14'],
            ['2021', '90', '90', 'KSH 54,000', '12'],
        ];
        drawTable(headers, rows);
    } else if (reportScope === 'yearly' && reportType === 'financials') {
        const headers = ['Year', 'Total Revenue (KSH )', 'Sales Revenue (KSH )', 'Rental Income (KSH )', 'Taxes Collected (KSH )'];
        const rows = [
            ['2023', 'KSH 1,572,000', 'KSH 1,500,000', 'KSH 72,000', 'KSH 126,000'],
            ['2022', 'KSH 1,460,000', 'KSH 1,400,000', 'KSH 60,000', 'KSH 117,000'],
            ['2021', 'KSH 1,354,000', 'KSH 1,300,000', 'KSH 54,000', 'KSH 108,000'],
        ];
        drawTable(headers, rows);
    } else if (reportScope === 'yearly' && reportType === 'customerfeedback') {
        const headers = ['Year', 'Total Reviews', 'Average Rating', 'Positive Feedback (%)', 'Negative Feedback (%)'];
        const rows = [
            ['2023', '320', '4.5', '85%', '15%'],
            ['2022', '280', '4.3', '82%', '18%'],
            ['2021', '240', '4.2', '80%', '20%'],
        ];
        drawTable(headers, rows);
    }

    // Close the PDF
    doc.end();
});

module.exports = router;
