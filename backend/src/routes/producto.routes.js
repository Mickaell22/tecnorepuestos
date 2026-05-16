const router = require('express').Router();
const { verificarToken } = require('../middlewares/auth');
const { listar, obtener, crear, actualizar, desactivar } = require('../controllers/productoController');

router.get('/',               verificarToken, listar);
router.get('/:id',            verificarToken, obtener);
router.post('/',              verificarToken, crear);
router.put('/:id',            verificarToken, actualizar);
router.patch('/:id/desactivar', verificarToken, desactivar);

module.exports = router;
