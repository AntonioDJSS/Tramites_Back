const { Router } = require("express")
const { actualizarTramite,
        buscarTramite,
        crearTramite,
        mostrarTramite,
        borrarTramite,
        borrarAllTramite,
        cargarTramite } = require('../controllers/tramiteController')

const router = Router();

router.route('/:id').put(actualizarTramite)
router.route('/:id').delete(borrarTramite)
router.route('/borrar/all').delete(borrarAllTramite)
router.route('/buscarT').get(buscarTramite)
router.route('/cargarArchivo').post(cargarTramite)
router.route('/').post(crearTramite)
router.route('/').get(mostrarTramite)


module.exports =  router;