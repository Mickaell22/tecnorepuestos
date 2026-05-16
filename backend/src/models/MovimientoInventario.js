const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimientoInventario = sequelize.define('MovimientoInventario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'productos', key: 'id' },
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'salida'),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  referencia: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: 'movimientos_inventario',
  timestamps: true,
  updatedAt: false,
});

module.exports = MovimientoInventario;
