const { Router } = require('express');
const {check} = require('express-validator');

// const {validarCampos} = require('../middlewares/validar-campos');

const { tramitesGet,
        extraerDatos,
        tramiteCrear,
        tramiteBorrar,
        tramitesPut} = require('../controllers/tramites');


const router = Router();


router.get('/', tramitesGet );

router.post('/',extraerDatos);

router.post('/crear',tramiteCrear);

router.delete('/:id',[
    check('id','No es un ID válido').isMongoId(),
],tramiteBorrar);

router.put('/:id',[
    check('id','No es un ID válido').isMongoId(),
], tramitesPut);




module.exports = router;