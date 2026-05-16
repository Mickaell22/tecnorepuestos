/**
 * Calcula el total de una compra o venta sumando cantidad * precio de cada línea.
 * @param {Array<{cantidad: number, precio: number}>} detalles
 * @returns {number}
 */
function calcularTotal(detalles) {
  if (!Array.isArray(detalles) || detalles.length === 0) return 0;
  return detalles.reduce((suma, item) => suma + item.cantidad * item.precio, 0);
}

/**
 * Valida si hay stock suficiente para una cantidad solicitada.
 * @param {number} stockActual
 * @param {number} cantidadSolicitada
 * @returns {boolean}
 */
function hayStockSuficiente(stockActual, cantidadSolicitada) {
  return stockActual >= cantidadSolicitada;
}

module.exports = { calcularTotal, hayStockSuficiente };
