const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ruc: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  correo: {
    type: DataTypes.STRING(150),
  },
  direccion: {
    type: DataTypes.STRING(200),
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'proveedores',
  timestamps: true,
});

module.exports = Proveedor;
