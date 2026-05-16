const { Op } = require('sequelize');
const { Venta, DetalleVenta, Producto, Cliente, Usuario, MovimientoInventario } = require('../models');
const { calcularTotal, hayStockSuficiente } = require('../utils/calculos');
const { enviarCorreo } = require('../services/correoService');
const { generarComprobante } = require('../services/pdfService');

// GET /api/ventas
exports.listar = async (req, res) => {
  try {
    const { desde, hasta, cliente_id } = req.query;
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

    if (cliente_id) {
      where.cliente_id = cliente_id;
    }

    const ventas = await Venta.findAll({
      where,
      include: [{ model: Cliente, attributes: ['id', 'nombre', 'correo'] }],
      order: [['createdAt', 'DESC']],
    });

    return res.json(ventas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/ventas/:id
exports.obtener = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [
        { model: Cliente, attributes: ['id', 'nombre', 'correo', 'telefono'] },
        { model: Usuario, attributes: ['id', 'nombre', 'correo'] },
        {
          model: DetalleVenta,
          include: [{ model: Producto, attributes: ['id', 'nombre', 'sku', 'categoria'] }],
        },
      ],
    });

    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }

    return res.json(venta);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/ventas
exports.crear = async (req, res) => {
  try {
    const { cliente_id, detalles } = req.body;
    const usuario_id = req.usuario.id;

    if (!cliente_id || !Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ mensaje: 'cliente_id y detalles son requeridos' });
    }

    // 1. Validar stock para cada producto
    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.producto_id);
      if (!producto) {
        return res.status(404).json({ mensaje: `Producto ${detalle.producto_id} no encontrado` });
      }
      if (!hayStockSuficiente(producto.stock_actual, detalle.cantidad)) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock_actual}, solicitado: ${detalle.cantidad}`,
        });
      }
    }

    // 2. Calcular total usando precio vigente del producto
    const lineasTotal = [];
    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.producto_id);
      lineasTotal.push({ cantidad: detalle.cantidad, precio: parseFloat(producto.precio_unitario) });
    }
    const total = calcularTotal(lineasTotal);

    // 3. Crear la venta
    const venta = await Venta.create({ cliente_id, usuario_id, total });

    // 4. Crear detalles, decrementar stock y registrar movimientos
    const adminUsuario = await Usuario.findOne({ where: { rol: 'administrador' }, attributes: ['correo'] });
    const correoAdmin = adminUsuario ? adminUsuario.correo : null;

    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.producto_id);

      await DetalleVenta.create({
        venta_id: venta.id,
        producto_id: detalle.producto_id,
        cantidad: detalle.cantidad,
        precio_unitario: parseFloat(producto.precio_unitario),
      });

      const nuevoStock = producto.stock_actual - detalle.cantidad;
      await producto.update({ stock_actual: nuevoStock });

      await MovimientoInventario.create({
        producto_id: producto.id,
        tipo: 'salida',
        cantidad: detalle.cantidad,
        referencia: `Venta #${venta.id}`,
      });

      // 7. Alerta de stock bajo
      if (nuevoStock <= producto.stock_minimo && correoAdmin) {
        try {
          await enviarCorreo({
            para: correoAdmin,
            asunto: `Alerta de stock: ${producto.nombre}`,
            cuerpo: `<p>El producto <strong>${producto.nombre}</strong> (SKU: ${producto.sku}) tiene stock bajo tras la venta #${venta.id}.<br>Stock actual: <strong>${nuevoStock}</strong> | Minimo: <strong>${producto.stock_minimo}</strong></p>`,
          });
        } catch (_) {
          // No interrumpir la operacion si el correo falla
        }
      }
    }

    // 8. Correo de confirmacion al cliente
    const cliente = await Cliente.findByPk(cliente_id, { attributes: ['correo', 'nombre'] });
    if (cliente && cliente.correo) {
      try {
        await enviarCorreo({
          para: cliente.correo,
          asunto: 'Confirmacion de compra — TecnoRepuestos S.A.',
          cuerpo: `<p>Hola <strong>${cliente.nombre}</strong>,<br>Tu compra #${venta.id} fue confirmada. Total: <strong>$${total.toFixed(2)}</strong>.<br>Gracias por confiar en TecnoRepuestos S.A.</p>`,
        });
      } catch (_) {
        // No interrumpir la operacion si el correo falla
      }
    }

    const ventaConDetalles = await Venta.findByPk(venta.id, {
      include: [
        { model: Cliente, attributes: ['id', 'nombre', 'correo'] },
        { model: DetalleVenta, include: [{ model: Producto, attributes: ['id', 'nombre', 'sku'] }] },
      ],
    });

    return res.status(201).json(ventaConDetalles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/ventas/:id/comprobante
exports.descargarComprobante = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [
        { model: Cliente, attributes: ['id', 'nombre', 'correo'] },
        { model: DetalleVenta, include: [{ model: Producto, attributes: ['id', 'nombre', 'sku'] }] },
      ],
    });

    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }

    const datos = {
      id: venta.id,
      fecha: venta.createdAt ? venta.createdAt.toLocaleDateString('es-EC') : new Date().toLocaleDateString('es-EC'),
      cliente: venta.Cliente ? venta.Cliente.nombre : 'Cliente',
      total: parseFloat(venta.total),
    };

    const doc = generarComprobante(datos);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=comprobante_venta_${venta.id}.pdf`);

    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
