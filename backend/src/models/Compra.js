const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Compra = sequelize.define('Compra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'proveedores', key: 'id' },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('confirmada', 'anulada'),
    defaultValue: 'confirmada',
  },
}, {
  tableName: 'compras',
  timestamps: true,
});

module.exports = Compra;
