const { Op } = require('sequelize');
const { Compra, DetalleCompra, Producto, Proveedor, Usuario, MovimientoInventario } = require('../models');
const { calcularTotal } = require('../utils/calculos');
const { enviarCorreo } = require('../services/correoService');

// GET /api/compras
exports.listar = async (req, res) => {
  try {
    const { desde, hasta, proveedor_id } = req.query;
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

    if (proveedor_id) {
      where.proveedor_id = proveedor_id;
    }

    const compras = await Compra.findAll({
      where,
      include: [{ model: Proveedor, attributes: ['id', 'nombre', 'ruc'] }],
      order: [['createdAt', 'DESC']],
    });

    return res.json(compras);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/compras/:id
exports.obtener = async (req, res) => {
  try {
    const compra = await Compra.findByPk(req.params.id, {
      include: [
        { model: Proveedor, attributes: ['id', 'nombre', 'ruc', 'telefono', 'correo'] },
        { model: Usuario, attributes: ['id', 'nombre', 'correo'] },
        {
          model: DetalleCompra,
          include: [{ model: Producto, attributes: ['id', 'nombre', 'sku', 'categoria'] }],
        },
      ],
    });

    if (!compra) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }

    return res.json(compra);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/compras
exports.crear = async (req, res) => {
  try {
    const { proveedor_id, detalles } = req.body;
    const usuario_id = req.usuario.id;

    if (!proveedor_id || !Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ mensaje: 'proveedor_id y detalles son requeridos' });
    }

    // Calcular total usando calcularTotal (espera { cantidad, precio })
    const lineasTotal = detalles.map((d) => ({ cantidad: d.cantidad, precio: d.precio_compra }));
    const total = calcularTotal(lineasTotal);

    // Crear la compra
    const compra = await Compra.create({ proveedor_id, usuario_id, total });

    // Crear detalles, actualizar stock y movimientos
    const adminUsuario = await Usuario.findOne({ where: { rol: 'administrador' }, attributes: ['correo'] });
    const correoAdmin = adminUsuario ? adminUsuario.correo : null;

    for (const detalle of detalles) {
      await DetalleCompra.create({
        compra_id: compra.id,
        producto_id: detalle.producto_id,
        cantidad: detalle.cantidad,
        precio_compra: detalle.precio_compra,
      });

      const producto = await Producto.findByPk(detalle.producto_id);
      if (!producto) continue;

      const nuevoStock = producto.stock_actual + detalle.cantidad;
      await producto.update({ stock_actual: nuevoStock });

      await MovimientoInventario.create({
        producto_id: producto.id,
        tipo: 'entrada',
        cantidad: detalle.cantidad,
        referencia: `Compra #${compra.id}`,
      });

      // Alerta de stock bajo tras la compra (poco frecuente pero posible)
      if (nuevoStock <= producto.stock_minimo && correoAdmin) {
        try {
          await enviarCorreo({
            para: correoAdmin,
            asunto: `Alerta de stock: ${producto.nombre}`,
            cuerpo: `<p>El producto <strong>${producto.nombre}</strong> (SKU: ${producto.sku}) tiene stock bajo.<br>Stock actual: <strong>${nuevoStock}</strong> | Minimo: <strong>${producto.stock_minimo}</strong></p>`,
          });
        } catch (_) {
          // No interrumpir la operacion si el correo falla
        }
      }
    }

    const compraConDetalles = await Compra.findByPk(compra.id, {
      include: [
        { model: Proveedor, attributes: ['id', 'nombre'] },
        { model: DetalleCompra, include: [{ model: Producto, attributes: ['id', 'nombre', 'sku'] }] },
      ],
    });

    return res.status(201).json(compraConDetalles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
