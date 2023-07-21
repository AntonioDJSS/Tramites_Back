//Aqui se extrae un funcion de express
const { Router } = require('express');
const {check} = require('express-validator');
const { cerrarSesion,
        confirmar,
        comprobarToken,
        login, 
        googleSignIn,  
        olvidePassword, 
        nuevoPassword,
        registrar,
        deleteMe,
        getMe,
        oneUser} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const bcryptjs = require('bcryptjs');
const { emailExiste } = require('../helpers/db-validators');
const { protect } = require ('../middlewares/auth-validar')

const router = Router();

//Es enviar
//Aqui se validan los campos que vamos a recibir
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login );

router.get('/cerrarSesion', cerrarSesion)

router.get('/confirmar/:token', confirmar)

router.post('/registrar',[
    //Check es un middlerware que va a revisar el correo
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe de ser más de 6 letras').isLength({ min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    //hara una verificacion personalizada por eso el custom va a recibir com argumento el valor del body
    //Se le establece un rol vacio en cado de que no venga
    // check('rol').custom(  esRoleValido ),
    validarCampos
],registrar)

router.post('/olvide-password',[
    check('correo', 'El correo es obligatorio').isEmail(),
    validarCampos
],olvidePassword ); 

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.post('/google',[
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn );


//RUTAS DEL USUARIO//
//la ruta /me está protegida por el middleware protect, que verifica la autenticación del usuario a través del token y 
//configura req.usuario con la información del usuario. Luego, el middleware getMe verifica que req.usuario esté configurado 
//y extrae el id del usuario para que esté disponible en la consulta de la base de datos realizada por el middleware oneUser. 
//Finalmente, oneUser busca el documento del usuario por el id y devuelve una respuesta JSON con el resultado.
router.route('/me').get(protect, getMe, oneUser);
router.route('/deleteMe').delete(protect,deleteMe);



module.exports = router;