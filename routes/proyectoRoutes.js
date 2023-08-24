const { Router } = require("express")
const { crearProyecto,
        mostrarProyectos,
        actualizarProyectos,
        borrarProyectos,
        misProyectos } = require('../controllers/proyectoController')

const { protect } = require('../middlewares/auth-validar');
const router = Router();

router.post('/',[
    protect
], crearProyecto )

//USER
router.get('/misProyectos',[
    protect
], misProyectos)



//ADMIN
router.get('', mostrarProyectos )
router.put('/:id', actualizarProyectos )
router.delete('/:id', borrarProyectos )



module.exports =  router;