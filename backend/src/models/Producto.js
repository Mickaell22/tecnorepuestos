const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  categoria: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock_actual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'productos',
  timestamps: true,
});

module.exports = Producto;
