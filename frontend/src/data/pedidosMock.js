export const PEDIDOS_MOCK = [
  {
    id: 1,
    numero: 'VT-2026-001',
    fecha: '16/05/2026',
    estado: 'Entregado',
    total: 245.00,
    items: [
      { nombre: 'Cable USB-C 2m', cantidad: 2, precio: 12.50 },
      { nombre: 'Cargador 65W USB-C', cantidad: 1, precio: 35.00 },
      { nombre: 'Hub USB 3.0 7 puertos', cantidad: 1, precio: 42.00 },
      { nombre: 'Adaptador USB-C a MicroUSB', cantidad: 3, precio: 5.00 },
    ],
    metodo: 'Tarjeta',
    subtotal: 220.00,
    iva: 25.00,
  },
  {
    id: 6,
    numero: 'VT-2026-006',
    fecha: '12/05/2026',
    estado: 'Entregado',
    total: 75.00,
    items: [
      { nombre: 'Cable Lightning 1m', cantidad: 2, precio: 9.50 },
      { nombre: 'Adaptador USB-C a MicroUSB', cantidad: 4, precio: 5.00 },
      { nombre: 'Cable USB-C 2m', cantidad: 1, precio: 12.50 },
    ],
    metodo: 'Efectivo',
    subtotal: 67.00,
    iva: 8.00,
  },
];
