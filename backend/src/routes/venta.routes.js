const router = require('express').Router();
const { verificarToken } = require('../middlewares/auth');
const { listar, obtener, crear, descargarComprobante } = require('../controllers/ventaController');

router.get('/',               verificarToken, listar);
router.get('/:id',            verificarToken, obtener);
router.post('/',              verificarToken, crear);
router.get('/:id/comprobante', verificarToken, descargarComprobante);

module.exports = router;
