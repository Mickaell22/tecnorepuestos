const { Proveedor } = require('../models');

// GET /api/proveedores
exports.listar = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({ where: { activo: true } });
    return res.json(proveedores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/proveedores/:id
exports.obtener = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    return res.json(proveedor);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/proveedores
exports.crear = async (req, res) => {
  try {
    const { nombre, ruc, telefono, correo, direccion } = req.body;

    if (!nombre || !ruc) {
      return res.status(400).json({ mensaje: 'Nombre y RUC son requeridos' });
    }

    const proveedor = await Proveedor.create({ nombre, ruc, telefono, correo, direccion });
    return res.status(201).json(proveedor);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ mensaje: 'El RUC ya esta registrado' });
    }
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// PUT /api/proveedores/:id
exports.actualizar = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    const { nombre, ruc, telefono, correo, direccion, activo } = req.body;
    await proveedor.update({ nombre, ruc, telefono, correo, direccion, activo });
    return res.json(proveedor);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
