const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  direccion: {
    type: DataTypes.STRING(200),
  },
}, {
  tableName: 'clientes',
  timestamps: true,
});

module.exports = Cliente;
