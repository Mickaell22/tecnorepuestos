// Script de datos iniciales de prueba
// Ejecutar con: npm run seed

require('dotenv').config();
const sequelize = require('../src/config/database');

async function seed() {
  await sequelize.authenticate();
  console.log('Conexión establecida. Ejecutando seed...');
  // TODO: insertar usuarios, productos y proveedores de prueba
  console.log('Seed completado.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error en seed:', err);
  process.exit(1);
});
