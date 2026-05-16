const { Cliente, Venta, DetalleVenta, Producto } = require('../models');

// GET /api/clientes
exports.listar = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      attributes: { exclude: ['contrasena'] },
      order: [['nombre', 'ASC']],
    });
    return res.json(clientes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/clientes/:id
exports.obtener = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      attributes: { exclude: ['contrasena'] },
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    return res.json(cliente);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/clientes/:id/ventas
exports.ventasCliente = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      where: { cliente_id: req.params.id },
      include: [
        {
          model: DetalleVenta,
          include: [{ model: Producto, attributes: ['id', 'nombre', 'sku', 'categoria'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json(ventas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
