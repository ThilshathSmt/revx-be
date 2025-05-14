// utils/exportUtils.js
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

exports.exportToCSV = (data, res) => {
  try {
    const fields = ['goalId', 'managerName', 'status', 'dueDate', 'submissionDate', 'managerReview'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('performance_report.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.exportToPDF = (data, res) => {
  try {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=performance_report.pdf');

    doc.pipe(res);
    doc.fontSize(16).text('Performance Report', { align: 'center' });

    data.forEach((item, i) => {
      doc
        .moveDown()
        .fontSize(12)
        .text(`${i + 1}. Goal ID: ${item.goalId}`)
        .text(`Manager: ${item.managerName}`)
        .text(`Status: ${item.status}`)
        .text(`Due: ${new Date(item.dueDate).toDateString()}`)
        .text(`Submitted: ${item.submissionDate ? new Date(item.submissionDate).toDateString() : 'N/A'}`)
        .text(`Review: ${item.managerReview || 'No Review'}`)
        .moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
