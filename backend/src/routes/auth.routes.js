const router = require('express').Router();
const { login, registro, logout, loginCliente, registroCliente } = require('../controllers/authController');

router.post('/login', login);
router.post('/registro', registro);
router.post('/logout', logout);
router.post('/cliente/login', loginCliente);
router.post('/cliente/registro', registroCliente);

module.exports = router;
