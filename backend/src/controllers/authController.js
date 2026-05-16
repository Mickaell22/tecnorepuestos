const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Cliente } = require('../models');

const SALT_ROUNDS = 10;
const ROLES_VALIDOS = ['administrador', 'vendedor'];

// POST /api/auth/registro — solo admin puede crear usuarios internos
exports.registro = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    // Solo administradores pueden registrar usuarios
    if (!req.usuario || req.usuario.rol !== 'administrador') {
      return res.status(403).json({ mensaje: 'Solo el administrador puede crear usuarios' });
    }

    if (!nombre || !correo || !contrasena || !rol) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
    }

    if (!ROLES_VALIDOS.includes(rol)) {
      return res.status(400).json({ mensaje: 'Rol no valido. Use: administrador o vendedor' });
    }

    const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
    const usuario = await Usuario.create({ nombre, correo, contrasena: hash, rol });

    const { contrasena: _, ...datos } = usuario.toJSON();
    return res.status(201).json(datos);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ mensaje: 'El correo ya esta registrado' });
    }
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Correo y contrasena son requeridos' });
    }

    const usuario = await Usuario.findOne({ where: { correo, activo: true } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token, rol: usuario.rol, nombre: usuario.nombre, id: usuario.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  return res.json({ mensaje: 'Sesion cerrada correctamente' });
};

// POST /api/auth/cliente/registro
exports.registroCliente = async (req, res) => {
  try {
    const { nombre, correo, contrasena, telefono, direccion } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Nombre, correo y contrasena son requeridos' });
    }

    const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
    const cliente = await Cliente.create({ nombre, correo, contrasena: hash, telefono, direccion });

    const { contrasena: _, ...datos } = cliente.toJSON();
    return res.status(201).json(datos);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ mensaje: 'El correo ya esta registrado' });
    }
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/auth/cliente/login
exports.loginCliente = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Correo y contrasena son requeridos' });
    }

    const cliente = await Cliente.findOne({ where: { correo } });
    if (!cliente) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const coincide = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: cliente.id, rol: 'cliente', nombre: cliente.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token, rol: 'cliente', nombre: cliente.nombre, id: cliente.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
