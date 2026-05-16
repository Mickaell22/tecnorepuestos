const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Venta = sequelize.define('Venta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'clientes', key: 'id' },
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
  tableName: 'ventas',
  timestamps: true,
});

module.exports = Venta;
