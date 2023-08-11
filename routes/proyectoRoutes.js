const { Router } = require("express")
const { crearProyecto,
    mostrarProyectos,
        actualizarProyecto,
        borrarProyecto } = require('../controllers/proyectoController')

const router = Router();

router.post('/', crearProyecto )
router.get('', mostrarProyectos )
router.put('/:id', actualizarProyecto )
router.delete('/:id', borrarProyecto )



module.exports =  router;