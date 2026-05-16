const { Op, fn, col, literal } = require('sequelize');
const { Venta, Compra, Producto, DetalleVenta, DetalleCompra, Cliente, Proveedor } = require('../models');

// GET /api/reportes/ventas?desde=&hasta=
exports.ventas = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const where = {};

    if (desde || hasta) {
      where.createdAt = {};
      if (desde) where.createdAt[Op.gte] = new Date(desde);
      if (hasta) {
        const fin = new Date(hasta);
        fin.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = fin;
      }
    }

    const ventas = await Venta.findAll({
      where,
      include: [
        { model: Cliente, attributes: ['id', 'nombre', 'correo'] },
        {
          model: DetalleVenta,
          include: [{ model: Producto, attributes: ['id', 'nombre', 'sku'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const totalIngresos = ventas.reduce((suma, v) => suma + parseFloat(v.total), 0);
    const totalTransacciones = ventas.length;

    return res.json({
      totalTransacciones,
      totalIngresos: parseFloat(totalIngresos.toFixed(2)),
      ventas,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/reportes/inventario
exports.inventario = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']],
    });

    const conEstado = productos.map((p) => {
      const sinStock = p.stock_actual === 0;
      const bajominimo = !sinStock && p.stock_actual <= p.stock_minimo;
      return {
        ...p.toJSON(),
        estado: sinStock ? 'sin_stock' : bajominimo ? 'bajo_minimo' : 'normal',
      };
    });

    const sinStock = conEstado.filter((p) => p.estado === 'sin_stock').length;
    const bajoMinimo = conEstado.filter((p) => p.estado === 'bajo_minimo').length;
    const normal = conEstado.filter((p) => p.estado === 'normal').length;

    return res.json({
      resumen: { total: productos.length, sinStock, bajoMinimo, normal },
      productos: conEstado,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/reportes/compras?desde=&hasta=
exports.compras = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const where = {};

    if (desde || hasta) {
      where.createdAt = {};
      if (desde) where.createdAt[Op.gte] = new Date(desde);
      if (hasta) {
        const fin = new Date(hasta);
        fin.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = fin;
      }
    }

    const compras = await Compra.findAll({
      where,
      include: [
        { model: Proveedor, attributes: ['id', 'nombre', 'ruc'] },
        {
          model: DetalleCompra,
          include: [{ model: Producto, attributes: ['id', 'nombre', 'sku'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const totalGasto = compras.reduce((suma, c) => suma + parseFloat(c.total), 0);
    const totalCompras = compras.length;

    return res.json({
      totalCompras,
      totalGasto: parseFloat(totalGasto.toFixed(2)),
      compras,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
