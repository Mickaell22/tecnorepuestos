const router = require('express').Router();
const { verificarToken } = require('../middlewares/auth');
const { listar, obtener, crear } = require('../controllers/compraController');

router.get('/',    verificarToken, listar);
router.get('/:id', verificarToken, obtener);
router.post('/',   verificarToken, crear);

module.exports = router;
