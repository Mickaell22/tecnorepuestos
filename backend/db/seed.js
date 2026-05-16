require('dotenv').config();
const bcrypt = require('bcrypt');

// Importar modelos (esto sincroniza la BD)
const {
  sequelize,
  Usuario,
  Cliente,
  Proveedor,
  Producto,
  Compra,
  DetalleCompra,
  Venta,
  DetalleVenta,
  MovimientoInventario,
} = require('../src/models');

const SALT_ROUNDS = 10;

async function seed() {
  await sequelize.authenticate();
  console.log('Conexion establecida. Recreando tablas...');

  // Recrear todas las tablas con force: true
  await sequelize.sync({ force: true });
  console.log('Tablas recreadas.');

  // ─── Usuarios ────────────────────────────────────────────────────────────
  const hashAdmin     = await bcrypt.hash('Admin2025!',    SALT_ROUNDS);
  const hashVendedor  = await bcrypt.hash('Vendedor2025!', SALT_ROUNDS);

  const admin = await Usuario.create({
    nombre: 'Juan Garcia',
    correo: 'admin@tecnorepuestos.com',
    contrasena: hashAdmin,
    rol: 'administrador',
  });

  const vendedor = await Usuario.create({
    nombre: 'Luis Perez',
    correo: 'vendedor@tecnorepuestos.com',
    contrasena: hashVendedor,
    rol: 'vendedor',
  });

  console.log('Usuarios creados.');

  // ─── Cliente ─────────────────────────────────────────────────────────────
  const hashCliente = await bcrypt.hash('Cliente2025!', SALT_ROUNDS);

  const cliente = await Cliente.create({
    nombre: 'Marco Salazar',
    correo: 'cliente@correo.com',
    contrasena: hashCliente,
    telefono: '0991234567',
    direccion: 'Guayaquil, Ecuador',
  });

  console.log('Cliente creado.');

  // ─── Proveedor ───────────────────────────────────────────────────────────
  const proveedor = await Proveedor.create({
    nombre: 'ElectroDistribuciones S.A.',
    ruc: '0912345678001',
    telefono: '042123456',
    correo: 'ventas@electrodistribuciones.com',
    direccion: 'Av. de las Americas, Guayaquil',
  });

  console.log('Proveedor creado.');

  // ─── Productos ───────────────────────────────────────────────────────────
  const cableUsbc = await Producto.create({
    nombre: 'Cable USB-C 2m',
    descripcion: 'Cable de carga y datos USB-C de 2 metros',
    sku: 'CAB-USBC-2M',
    categoria: 'Cables',
    precio_unitario: 5.99,
    stock_actual: 50,
    stock_minimo: 10,
  });

  const cargador = await Producto.create({
    nombre: 'Cargador 65W',
    descripcion: 'Cargador rapido de 65W con puerto USB-C',
    sku: 'CAR-65W-001',
    categoria: 'Cargadores',
    precio_unitario: 25.99,
    stock_actual: 8,
    stock_minimo: 10,
  });

  const audifonos = await Producto.create({
    nombre: 'Audifonos BT',
    descripcion: 'Audifonos inalambricos Bluetooth',
    sku: 'AUD-BT-003',
    categoria: 'Audio',
    precio_unitario: 35.00,
    stock_actual: 0,
    stock_minimo: 5,
  });

  console.log('Productos creados.');

  // Movimientos de inventario por stock inicial
  await MovimientoInventario.create({ producto_id: cableUsbc.id, tipo: 'entrada', cantidad: 50, referencia: 'Stock inicial' });
  await MovimientoInventario.create({ producto_id: cargador.id,  tipo: 'entrada', cantidad: 8,  referencia: 'Stock inicial' });
  // Audifonos arrancan en 0, sin movimiento inicial

  // ─── Compra ──────────────────────────────────────────────────────────────
  // Compra de 10 cables y 5 cargadores
  const totalCompra = (10 * 3.50) + (5 * 18.00); // precio compra (costo)
  const compra = await Compra.create({
    proveedor_id: proveedor.id,
    usuario_id: admin.id,
    total: totalCompra,
  });

  await DetalleCompra.create({ compra_id: compra.id, producto_id: cableUsbc.id, cantidad: 10, precio_compra: 3.50 });
  await DetalleCompra.create({ compra_id: compra.id, producto_id: cargador.id,  cantidad: 5,  precio_compra: 18.00 });

  await MovimientoInventario.create({ producto_id: cableUsbc.id, tipo: 'entrada', cantidad: 10, referencia: `Compra #${compra.id}` });
  await MovimientoInventario.create({ producto_id: cargador.id,  tipo: 'entrada', cantidad: 5,  referencia: `Compra #${compra.id}` });

  // Actualizar stock tras la compra
  await cableUsbc.update({ stock_actual: cableUsbc.stock_actual + 10 });
  await cargador.update({ stock_actual: cargador.stock_actual + 5 });

  console.log('Compra creada.');

  // ─── Ventas ──────────────────────────────────────────────────────────────
  // Venta 1: 2 cables USB-C
  const totalVenta1 = 2 * parseFloat(cableUsbc.precio_unitario);
  const venta1 = await Venta.create({ cliente_id: cliente.id, usuario_id: vendedor.id, total: totalVenta1 });
  await DetalleVenta.create({ venta_id: venta1.id, producto_id: cableUsbc.id, cantidad: 2, precio_unitario: parseFloat(cableUsbc.precio_unitario) });
  await MovimientoInventario.create({ producto_id: cableUsbc.id, tipo: 'salida', cantidad: 2, referencia: `Venta #${venta1.id}` });
  await cableUsbc.update({ stock_actual: cableUsbc.stock_actual + 10 - 2 }); // stock tras compra y venta

  // Venta 2: 1 cargador + 1 cable
  const totalVenta2 = parseFloat(cargador.precio_unitario) + parseFloat(cableUsbc.precio_unitario);
  const venta2 = await Venta.create({ cliente_id: cliente.id, usuario_id: admin.id, total: totalVenta2 });
  await DetalleVenta.create({ venta_id: venta2.id, producto_id: cargador.id,  cantidad: 1, precio_unitario: parseFloat(cargador.precio_unitario) });
  await DetalleVenta.create({ venta_id: venta2.id, producto_id: cableUsbc.id, cantidad: 1, precio_unitario: parseFloat(cableUsbc.precio_unitario) });
  await MovimientoInventario.create({ producto_id: cargador.id,  tipo: 'salida', cantidad: 1, referencia: `Venta #${venta2.id}` });
  await MovimientoInventario.create({ producto_id: cableUsbc.id, tipo: 'salida', cantidad: 1, referencia: `Venta #${venta2.id}` });

  console.log('Ventas creadas.');
  console.log('');
  console.log('Seed completado correctamente.');
  console.log('');
  console.log('Credenciales de prueba:');
  console.log('  Admin:    admin@tecnorepuestos.com    / Admin2025!');
  console.log('  Vendedor: vendedor@tecnorepuestos.com / Vendedor2025!');
  console.log('  Cliente:  cliente@correo.com          / Cliente2025!');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
