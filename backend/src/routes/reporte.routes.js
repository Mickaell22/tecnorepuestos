const router = require('express').Router();
const { verificarToken } = require('../middlewares/auth');
const { ventas, inventario, compras } = require('../controllers/reporteController');

router.get('/ventas',     verificarToken, ventas);
router.get('/inventario', verificarToken, inventario);
router.get('/compras',    verificarToken, compras);

module.exports = router;
