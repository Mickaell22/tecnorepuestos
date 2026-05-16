const router = require('express').Router();
const { verificarToken } = require('../middlewares/auth');
const { listar, obtener, crear, actualizar } = require('../controllers/proveedorController');

router.get('/',    verificarToken, listar);
router.get('/:id', verificarToken, obtener);
router.post('/',   verificarToken, crear);
router.put('/:id', verificarToken, actualizar);

module.exports = router;
