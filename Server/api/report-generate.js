const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const CarListing = require('../models/CarListing');
const User = require('../models/Users');

/**
 * GET /api/reports/generate
 * Generates a PDF report of bookings/payments in KSH.
 * Query params:
 *   type     — 'bookings' | 'payments' | 'inventory' | 'full'  (default: 'full')
 *   from     — ISO date string start filter (optional)
 *   to       — ISO date string end filter   (optional)
 *   format   — 'pdf' | 'json'               (default: 'pdf')
 */

// ── Helper: format KSH amount ──────────────────────────────────────────────
function ksh(amount) {
  const n = parseFloat(amount?.$numberDecimal || amount || 0);
  return `KSH ${n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Helper: safe date ──────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Route ──────────────────────────────────────────────────────────────────
router.get('/generate', async (req, res) => {
  try {
    const { type = 'full', from, to, format = 'pdf' } = req.query;

    // Date filter
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to)   dateFilter.$lte = new Date(to);

    const bookingQuery  = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
    const paymentQuery  = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

    // Fetch data
    const [bookings, payments, listings] = await Promise.all([
      (type === 'bookings' || type === 'full') ? Booking.find(bookingQuery).sort({ createdAt: -1 }) : [],
      (type === 'payments' || type === 'full') ? Payment.find(paymentQuery).sort({ createdAt: -1 }) : [],
      (type === 'inventory' || type === 'full') ? CarListing.find({ listing_status: { $ne: 'deleted' } }) : [],
    ]);

    // ── JSON output ──────────────────────────────────────────────────────
    if (format === 'json') {
      const totalRevenue = payments.reduce((sum, p) => {
        return sum + parseFloat(p.amount?.$numberDecimal || p.amount || 0);
      }, 0);

      return res.json({
        reportDate:    new Date().toISOString(),
        currency:      'KSH',
        summary: {
          totalBookings:  bookings.length,
          totalPayments:  payments.length,
          totalRevenue:   ksh(totalRevenue),
          totalListings:  listings.length,
          activeListings: listings.filter(l => l.listing_status === 'active').length,
        },
        bookings:  bookings,
        payments:  payments,
        inventory: listings,
      });
    }

    // ── PDF output ────────────────────────────────────────────────────────
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="roditec-report-${Date.now()}.pdf"`);
    doc.pipe(res);

    // ── PDF: Header ──────────────────────────────────────────────────────
    doc
      .fontSize(22).font('Helvetica-Bold')
      .text('RODITEC', 50, 50)
      .fontSize(11).font('Helvetica')
      .fillColor('#3B6BF0')
      .text("Kenya's Premier Auto Marketplace", 50, 76)
      .fillColor('#000000');

    doc
      .moveTo(50, 100).lineTo(545, 100).strokeColor('#E5E7F0').lineWidth(1).stroke()
      .fontSize(18).font('Helvetica-Bold')
      .text('Business Report', 50, 114)
      .fontSize(10).font('Helvetica').fillColor('#666')
      .text(`Generated: ${new Date().toLocaleString('en-KE')}`, 50, 138)
      .text(`Currency: KSH (Kenyan Shillings)`, 50, 152)
      .fillColor('#000000');

    if (from || to) {
      doc.fontSize(10).text(`Period: ${from ? fmtDate(from) : 'All time'} — ${to ? fmtDate(to) : 'Present'}`, 50, 166);
    }

    let yPos = from || to ? 190 : 175;

    // ── PDF: Summary box ─────────────────────────────────────────────────
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount?.$numberDecimal || p.amount || 0), 0);
    const activeListings = listings.filter(l => l.listing_status === 'active').length;

    doc.rect(50, yPos, 495, 90).fillColor('#F7F8FC').fill();
    doc.rect(50, yPos, 495, 90).strokeColor('#E5E7F0').lineWidth(1).stroke();

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1A1A2E')
      .text('Summary', 66, yPos + 12);

    doc.fontSize(10).font('Helvetica').fillColor('#333');
    const cols = [
      ['Total Bookings',  String(bookings.length)],
      ['Total Payments',  String(payments.length)],
      ['Total Revenue',   ksh(totalRevenue)],
      ['Active Listings', String(activeListings)],
    ];
    cols.forEach(([label, val], i) => {
      const x = 66 + (i % 2) * 240;
      const y = yPos + 32 + Math.floor(i / 2) * 22;
      doc.text(`${label}:`, x, y).font('Helvetica-Bold').text(val, x + 110, y).font('Helvetica');
    });

    yPos += 110;

    // ── PDF section helper ───────────────────────────────────────────────
    function sectionHeader(title) {
      if (yPos > 700) { doc.addPage(); yPos = 50; }
      doc.moveTo(50, yPos).lineTo(545, yPos).strokeColor('#3B6BF0').lineWidth(2).stroke();
      yPos += 6;
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#1A1A2E').text(title, 50, yPos);
      yPos += 22;
      doc.moveTo(50, yPos).lineTo(545, yPos).strokeColor('#E5E7F0').lineWidth(0.5).stroke();
      yPos += 10;
    }

    function tableRow(cols, widths, isHeader = false) {
      if (yPos > 720) { doc.addPage(); yPos = 50; }
      let x = 50;
      doc.fontSize(9)
        .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
        .fillColor(isHeader ? '#3B6BF0' : '#333');
      cols.forEach((col, i) => {
        doc.text(String(col), x + 4, yPos, { width: widths[i] - 8, ellipsis: true });
        x += widths[i];
      });
      if (isHeader) {
        doc.moveTo(50, yPos + 14).lineTo(545, yPos + 14).strokeColor('#E5E7F0').lineWidth(0.5).stroke();
      }
      yPos += 18;
      doc.fillColor('#000');
    }

    // ── PDF: Bookings ─────────────────────────────────────────────────────
    if (type === 'bookings' || type === 'full') {
      sectionHeader(`Bookings (${bookings.length})`);
      tableRow(['Booking ID', 'Transaction ID', 'Date', 'Total (KSH)', 'Paid (KSH)', 'Status'], [80, 120, 90, 90, 90, 75], true);
      bookings.forEach(b => {
        tableRow([
          b.booking_id   || '—',
          b.transaction_id || '—',
          fmtDate(b.booking_start_date),
          ksh(b.total_price),
          ksh(b.paid_price),
          b.booking_status || '—',
        ], [80, 120, 90, 90, 90, 75]);
      });
      yPos += 16;
    }

    // ── PDF: Payments ─────────────────────────────────────────────────────
    if (type === 'payments' || type === 'full') {
      sectionHeader(`Payments (${payments.length})`);
      tableRow(['Transaction ID', 'Date', 'Amount (KSH)', 'Method', 'Status'], [130, 100, 110, 110, 95], true);
      payments.forEach(p => {
        tableRow([
          p.transaction_id  || '—',
          fmtDate(p.createdAt),
          ksh(p.amount),
          p.payment_method  || '—',
          p.payment_status  || '—',
        ], [130, 100, 110, 110, 95]);
      });

      // Revenue total
      yPos += 8;
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#1A1A2E')
        .text(`Total Revenue: ${ksh(totalRevenue)}`, 380, yPos, { align: 'right', width: 165 });
      doc.fillColor('#000');
      yPos += 24;
    }

    // ── PDF: Inventory ────────────────────────────────────────────────────
    if (type === 'inventory' || type === 'full') {
      sectionHeader(`Vehicle Inventory (${listings.length})`);
      tableRow(['Make & Model', 'Year', 'Type', 'Price (KSH)', 'Status'], [170, 55, 80, 130, 110], true);
      listings.forEach(l => {
        tableRow([
          `${l.make} ${l.model}`,
          String(l.year || '—'),
          l.RentSell || '—',
          ksh(l.price),
          l.listing_status || '—',
        ], [170, 55, 80, 130, 110]);
      });
      yPos += 16;
    }

    // ── PDF: Footer ───────────────────────────────────────────────────────
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).font('Helvetica').fillColor('#999')
        .text(
          `Roditec — Confidential Business Report | Page ${i + 1} of ${pages.count} | All amounts in KSH`,
          50, doc.page.height - 40,
          { align: 'center', width: 495 }
        );
    }

    doc.end();

  } catch (error) {
    console.error('Report generate error:', error);
    if (!res.headersSent) {
      res.status(500).json({ flag: '0', message: 'Failed to generate report.' });
    }
  }
});

module.exports = router;