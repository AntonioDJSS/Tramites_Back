const { response } = require("express");
const Tramite = require('../models/tramite')
const xlsx = require('xlsx');
const path = require('path');
// const { v4: uuidv4 } = require('uuid');





const tramitesGet = async (req = request, res= response) =>{
    try {
        const { page = 1, limit = 2 } = req.query;
        //parseInt se utiliza para que se asegure que es un numero en vez de una cadena
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
    
        const skip = (parsedPage - 1) * parsedLimit;
        //find se utiliza para crear una consulta en mongosee
        const query = Tramite.find({ estado: true })
          .skip(skip)
          .limit(parsedLimit);
    
        const tramites = await query;
        const total = await Tramite.countDocuments({ estado: true });
    
        res.json({ total, tramites });
    } catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un error al obtener los tramites'
        })
    }
    
}

const extraerDatos = async  (req, res = response) =>{
    try {
////////////////Ingresamos el archivo validando que es xlsx//////////////////
     if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        res.status(400).json({ msg: 'No hay archivos que subir' });
        return;
    }
    const { archivo } = req.files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[ nombreCortado.length - 1 ];
    //Validar la extension
    const extensionesValidas = [ 'xlsx' ];
    if ( !extensionesValidas.includes( extension )) {
        return res.status(400).json({
            msg: `La extensión ${ extension } no es permitida, ${ extensionesValidas }`
        });
    }
    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join( __dirname, '../uploads/', nombreTemp);
    archivo.mv(uploadPath, (err) => { 
        if (err) {
        return res.status(500).json({err});
    }
///////////////////////////////////////////////////////////////    

////////////////////////Leer archivo de excel /////////////////
    const workbook = xlsx.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Convertir los datos a JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
/////////////////////////////////////////////////////////////////////

for (const item of jsonData) {
    // Verificar cada propiedad del objeto y asignarle null si está vacía
    for (const key in item) {
      if (item.hasOwnProperty(key) && item[key] === '') {
        item[key] = null;
      }
    }
  
    const tramite = new Tramite(item);
    tramite.save();
  }

    res.json({ msg: 'File uploaded to ' + uploadPath,
                jsonData });
});
   } catch (error) {
    console.log(error)
   }
}

const tramiteCrear = async (req, res = response) =>{

    try {
        // Crea una instancia del modelo Tramite con los datos recibidos en la solicitud
        const nuevoTramite = new Tramite(req.body);
    
        // Guarda el nuevoTramite en la base de datos
        const tramiteGuardado = await nuevoTramite.save();
    
        // Envía una respuesta con el tramiteGuardado
        res.status(201).json(tramiteGuardado);
      } catch (error) {
        // Manejo de errores
        res.status(500).json({ error: 'Ocurrió un error al crear el tramite' });
      }
}

const tramiteBorrar = async (req, res = response) =>{
  const { id } = req.params;
  const tramite = await Tramite.findOne({ _id: id });

  if (!tramite) {
    return res.status(404).json({ error: 'El tramite no existe' });
  }
  try{
    tramite.estado = false;
    await tramite.save();
    res.json({ msg: "Tramite Borrado Correctamente"})
  } catch (error) {
    console.log(error);
    res.json({ msg: "Ocurrio un problema al borrar el tramite"})
  }
  
 
}

const tramitesPut = async (req, res = response) =>{
    const { id } = req.params;
    const { identificador, estado, tipo, periodo, etasintransicion, etacontransicion, antesexploracion, exploracionevaluacionpotencial, exploracionincorporacionreservas, exploracionprogramaevaluacion, revaluacion,
          producciontemprana, antesdesarrollo, antesinicioproduccion, produccionregular, abandono, devolucionarea, regulacion, regulacioncorto, articuloonumeral, dependencias, detonante, aguasprofundas, aguassomeras,
          terrestres, presentacion, nombre,nombreconamer, numerotramiteconamer, nombreformato, homoclaveformatoconamer, periodicidad, plazopresentar, sujetoarespuesta, plazomaximorespuestaresolucion, tienemontoderechos,
          nombreaprovechamiento, montomxn, comentarios, revision, fechaingreso, fechamaximaresolucion, fechaminimaresolucion, plazoprevencion, plazorespuestaprevencion, plazorespuesta, plazomaximorespuesta, nombrederesolucion,
          link, referencia, requisitos } = req.body

    try {
         // Actualizar el tramite
    await Tramite.findByIdAndUpdate(id, { $set: { identificador, estado, tipo, periodo, etasintransicion, etacontransicion, antesexploracion, exploracionevaluacionpotencial, exploracionincorporacionreservas, exploracionprogramaevaluacion, revaluacion,
                                                  producciontemprana, antesdesarrollo, antesinicioproduccion, produccionregular, abandono, devolucionarea, regulacion, regulacioncorto, articuloonumeral, dependencias, detonante, aguasprofundas, aguassomeras,
                                                  terrestres, presentacion, nombre,nombreconamer, numerotramiteconamer, nombreformato, homoclaveformatoconamer, periodicidad, plazopresentar, sujetoarespuesta, plazomaximorespuestaresolucion, tienemontoderechos,
                                                  nombreaprovechamiento, montomxn, comentarios, revision, fechaingreso, fechamaximaresolucion, fechaminimaresolucion, plazoprevencion, plazorespuestaprevencion, plazorespuesta, plazomaximorespuesta, nombrederesolucion,
                                                  link, referencia, requisitos } }, { new: true });

    // Obtener el tramite actualizado
    const tramiteActualizado = await Tramite.findById(id);

    // Enviar la respuesta con el tramite actualizado
    return res.json(tramiteActualizado);
    } catch (error) {
          return res.status(500).json({ error: "No se puedo actualizar el tramite"})  
    }
}

module.exports = {
    tramitesGet,
    extraerDatos,
    tramiteCrear,
    tramiteBorrar,
    tramitesPut
}