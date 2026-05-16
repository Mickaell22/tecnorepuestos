const sequelize = require('../config/database');

const Usuario             = require('./Usuario');
const Cliente             = require('./Cliente');
const Proveedor           = require('./Proveedor');
const Producto            = require('./Producto');
const Compra              = require('./Compra');
const DetalleCompra       = require('./DetalleCompra');
const Venta               = require('./Venta');
const DetalleVenta        = require('./DetalleVenta');
const MovimientoInventario = require('./MovimientoInventario');

// Asociaciones Usuario
Usuario.hasMany(Compra, { foreignKey: 'usuario_id' });
Usuario.hasMany(Venta,  { foreignKey: 'usuario_id' });

// Asociaciones Proveedor
Proveedor.hasMany(Compra, { foreignKey: 'proveedor_id' });

// Asociaciones Compra
Compra.belongsTo(Usuario,   { foreignKey: 'usuario_id' });
Compra.belongsTo(Proveedor, { foreignKey: 'proveedor_id' });
Compra.hasMany(DetalleCompra, { foreignKey: 'compra_id' });

// Asociaciones DetalleCompra
DetalleCompra.belongsTo(Compra,   { foreignKey: 'compra_id' });
DetalleCompra.belongsTo(Producto, { foreignKey: 'producto_id' });

// Asociaciones Cliente
Cliente.hasMany(Venta, { foreignKey: 'cliente_id' });

// Asociaciones Venta
Venta.belongsTo(Cliente,  { foreignKey: 'cliente_id' });
Venta.belongsTo(Usuario,  { foreignKey: 'usuario_id' });
Venta.hasMany(DetalleVenta, { foreignKey: 'venta_id' });

// Asociaciones DetalleVenta
DetalleVenta.belongsTo(Venta,    { foreignKey: 'venta_id' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'producto_id' });

// Asociaciones Producto
Producto.hasMany(MovimientoInventario, { foreignKey: 'producto_id' });
MovimientoInventario.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = {
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
};
