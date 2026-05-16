const { Op } = require('sequelize');
const { Producto, MovimientoInventario } = require('../models');

// GET /api/productos
exports.listar = async (req, res) => {
  try {
    const { nombre, categoria, stock } = req.query;
    const where = { activo: true };

    if (nombre) {
      where.nombre = { [Op.iLike]: `%${nombre}%` };
    }
    if (categoria) {
      where.categoria = categoria;
    }
    if (stock === 'bajo') {
      where[Op.and] = [
        { stock_actual: { [Op.lte]: { [Op.col]: 'stock_minimo' } } },
      ];
    }

    const productos = await Producto.findAll({ where });
    return res.json(productos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/productos/:id
exports.obtener = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        {
          model: MovimientoInventario,
          order: [['createdAt', 'DESC']],
          limit: 10,
        },
      ],
    });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.json(producto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/productos
exports.crear = async (req, res) => {
  try {
    const { nombre, descripcion, sku, categoria, precio_unitario, stock_actual, stock_minimo } = req.body;

    if (!nombre || !sku || !categoria || precio_unitario === undefined) {
      return res.status(400).json({ mensaje: 'Nombre, SKU, categoria y precio son requeridos' });
    }

    const stockInicial = parseInt(stock_actual) || 0;

    const producto = await Producto.create({
      nombre,
      descripcion,
      sku,
      categoria,
      precio_unitario,
      stock_actual: stockInicial,
      stock_minimo: parseInt(stock_minimo) || 5,
    });

    if (stockInicial > 0) {
      await MovimientoInventario.create({
        producto_id: producto.id,
        tipo: 'entrada',
        cantidad: stockInicial,
        referencia: 'Stock inicial',
      });
    }

    return res.status(201).json(producto);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ mensaje: 'El SKU ya existe' });
    }
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// PUT /api/productos/:id
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, nombre, descripcion, categoria, precio_unitario, stock_minimo } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Verificar que el SKU no pertenezca a otro producto
    if (sku && sku !== producto.sku) {
      const existe = await Producto.findOne({ where: { sku, id: { [Op.ne]: id } } });
      if (existe) {
        return res.status(409).json({ mensaje: 'El SKU ya esta en uso por otro producto' });
      }
    }

    await producto.update({ sku, nombre, descripcion, categoria, precio_unitario, stock_minimo });
    return res.json(producto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// PATCH /api/productos/:id/desactivar
exports.desactivar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.update({ activo: false });
    return res.json({ mensaje: 'Producto desactivado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
