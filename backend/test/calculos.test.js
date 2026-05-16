const { calcularTotal, hayStockSuficiente } = require('../src/utils/calculos');

// --- calcularTotal ---

describe('calcularTotal', () => {
  test('calcula correctamente el total de varios productos', () => {
    const detalles = [
      { cantidad: 2, precio: 15.00 },
      { cantidad: 3, precio: 10.00 },
    ];
    expect(calcularTotal(detalles)).toBe(60.00);
  });

  test('retorna 0 si el arreglo está vacío', () => {
    expect(calcularTotal([])).toBe(0);
  });

  test('retorna 0 si no se pasa un arreglo', () => {
    expect(calcularTotal(null)).toBe(0);
    expect(calcularTotal(undefined)).toBe(0);
  });

  test('calcula correctamente con un solo producto', () => {
    const detalles = [{ cantidad: 5, precio: 8.50 }];
    expect(calcularTotal(detalles)).toBeCloseTo(42.50);
  });
});

// --- hayStockSuficiente ---

describe('hayStockSuficiente', () => {
  test('retorna true si el stock es mayor que la cantidad solicitada', () => {
    expect(hayStockSuficiente(10, 5)).toBe(true);
  });

  test('retorna true si el stock es exactamente igual a la cantidad solicitada', () => {
    expect(hayStockSuficiente(5, 5)).toBe(true);
  });

  test('retorna false si el stock es menor que la cantidad solicitada', () => {
    expect(hayStockSuficiente(3, 5)).toBe(false);
  });

  test('retorna false si el stock es 0', () => {
    expect(hayStockSuficiente(0, 1)).toBe(false);
  });
});
