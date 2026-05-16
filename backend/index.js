require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth',       require('./src/routes/auth.routes'));
app.use('/api/productos',  require('./src/routes/producto.routes'));
app.use('/api/proveedores',require('./src/routes/proveedor.routes'));
app.use('/api/compras',    require('./src/routes/compra.routes'));
app.use('/api/ventas',     require('./src/routes/venta.routes'));
app.use('/api/clientes',   require('./src/routes/cliente.routes'));
app.use('/api/reportes',   require('./src/routes/reporte.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
