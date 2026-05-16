const router = require('express').Router();
const { verificarToken } = require('../middlewares/auth');
const { listar, obtener, ventasCliente } = require('../controllers/clienteController');

router.get('/',           verificarToken, listar);
router.get('/:id',        verificarToken, obtener);
router.get('/:id/ventas', verificarToken, ventasCliente);

module.exports = router;
