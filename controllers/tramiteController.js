const Tramite = require('../models/tramite')

const crearTramite = async (req, res ) => {

    const tramite = Tramite(req.body);

    const response = await tramite.save();

    res.status(200).json({
        status: "success",
        data: response,
    })
}

const validarCampos = ( req, res, next) => {

    const data = (req.body);



    res.send({
        data
    })
    next();
}

module.exports ={
    crearTramite,
    validarCampos
}