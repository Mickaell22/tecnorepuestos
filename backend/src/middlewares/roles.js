function soloRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario?.rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    next();
  };
}

module.exports = { soloRoles };
