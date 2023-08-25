const { Router } = require("express")
const { crearProyecto,
        mostrarProyectos,
        actualizarProyectos,
        borrarProyectos,
        misProyectos,
        actualizarProyecto,
        borrarProyecto } = require('../controllers/proyectoController')

const { protect } = require('../middlewares/auth-validar');
const router = Router();


//RUTAS PARA TODOS
router.post('/',[
    protect
], crearProyecto )

//USER
router.get('/misProyectos',[
    protect
], misProyectos)

router.put('/actualizarProyecto/:id',[
    protect
], actualizarProyecto )

router.delete('/borrarProyecto/:id',[
    protect
],borrarProyecto)

//ADMIN
router.get('', mostrarProyectos )
router.put('/:id', actualizarProyectos )
router.delete('/:id', borrarProyectos )



module.exports =  router;