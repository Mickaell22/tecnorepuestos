const PDFDocument = require('pdfkit');

function generarComprobante(venta) {
  const doc = new PDFDocument();
  doc.fontSize(18).text('TecnoRepuestos S.A.', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Comprobante de venta #${venta.id}`);
  doc.text(`Fecha: ${venta.fecha}`);
  doc.text(`Cliente: ${venta.cliente}`);
  doc.text(`Total: $${venta.total}`);
  return doc;
}

module.exports = { generarComprobante };
