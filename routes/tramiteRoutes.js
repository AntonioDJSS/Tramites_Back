const { Router } = require("express")
const { crearTramite, validarCampos } = require('../controllers/tramiteController')

const router = Router();

router.route('/').post(validarCampos,crearTramite)

module.exports =  router;