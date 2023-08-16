//Aqui se extrae un funcion de express
const { Router } = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const { protect } = require ('../middlewares/auth-validar')

const { esRoleValido } = require('../helpers/db-validators');
const { existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, 
        usuariosPut,
        usuariosDelete,
        usuariosDeleteP
         } = require('../controllers/usuarios');

//Aqui llamamos a la funcion que estamos extrayendo de express
const router = Router();

//Get es recuperar
router.get('/',[
        protect,            ///Verifica que estes logueado
        /*validarJWT, */       //Valida que el token que le pasaste en los headers es existente y manda en la req.usuario
        esAdminRole,       //Valida que el req.usuario sea admin para darle acceso
        tieneRole('ADMIN_ROLE', 'USER_ROLE'), //Verifica que sea alguno de estos roles
        validarCampos
], usuariosGet  );



//Actualizar
router.put('/:id',[
        //Este middelaware ayuda a validar el id en la base de datos de Mongo
        check('id','No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom(  esRoleValido ),

        validarCampos
],usuariosPut );

//Elimina             Acceso ADMIN
router.delete('/:id',[
        protect, 
        // validarJWT,        //Valida que el token que le pasaste en los headers es existente y manda en la req.usuario
        esAdminRole,       //Valida que el req.usuario sea admin para darle acceso
        tieneRole('ADMIN_ROLE', 'USER_ROLE'), //Verifica que sea alguno de estos roles
        check('id','No es un ID válido').isMongoId(), //Busca si es un id de Mongo
        check('id').custom( existeUsuarioPorId ), //Busca si existe el Usuario por ID
        validarCampos //Si hay un problema anteriormente no te deja pasar  
], usuariosDelete );

//EliminaPermanente   Acceso ADMIN
router.delete('/permenente/:id',[
        protect, 
        // validarJWT,
        esAdminRole,
        tieneRole('ADMIN_ROLE', 'USER_ROLE'),
        check('id','No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
], usuariosDeleteP );





module.exports = router;