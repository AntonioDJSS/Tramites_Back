const Tramite = require('../models/tramite')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const xlsx = require('xlsx');

const actualizarTramite = async (req, res) => {
  const { id } = req.params;
  const nuevosTramites = req.body.tramites;
  try {
    const tramite = await Tramite.findOne({ _id: id });
    if (!tramite) {
      return res.status(404).json({ msg: 'Tramite no encontrado' });
    }

    const tramiteActualizado = tramite.toObject(); // Convertir a objeto JavaScript
    
    tramiteActualizado.tramites = tramiteActualizado.tramites.map(
        (tramiteAnterior, index) => {
        const nuevoTramite = nuevosTramites[index];
        return {
          ...tramiteAnterior,
          nombre: nuevoTramite.nombre,
          valor: nuevoTramite.valor
        };
      }
    );

    const tramiteActualizadoDB = await Tramite.findOneAndUpdate(
      { _id: id },
      tramiteActualizado,
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      tramite: tramiteActualizadoDB
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el tramite' });
  }
};

const borrarTramite = async (req, res) => {
    const { id } = req.params;
  
    try {
      const tramite = await Tramite.findOne({ _id: id });
      if (!tramite) {
        return res.status(404).json({ msg: 'Tramite no encontrado' });
      }
      tramite.tramites = tramite.tramites.filter((t) => t._id.toString() !== id);
      // Guardar los cambios utilizando la función `updateOne` de Mongoose
      await Tramite.deleteOne({ _id: id }, { tramites: tramite.tramites });
      res.status(200).json({ msg: 'Tramite eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al eliminar el tramite' });
    }
};

const borrarAllTramite = async (req, res) => {
  try {
    const tramites = await Tramite.find();

    if (tramites.length === 0) {
      return res.status(404).json({
        msg: 'No existe ningún trámite'
      });
    }

    await Tramite.deleteMany();

    res.status(200).json({
      status: 'success',
      msg: 'Se han eliminado todos los trámites'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar todos los trámites' });
  }
};

const buscarTramite = async (req, res) =>{

  const { nombre } = req.query; // Obtener el parámetro de consulta 'q'

  try {
    // Realizar la búsqueda en la base de datos utilizando Mongoose
      const tramites = await Tramite.find({
      'tramites': {
        $elemMatch: {
          nombre: 'Nombre',
          valor: { $regex: nombre, $options: 'i' }
        }
      }
      });

    
    res.status(200).json({
      status: 'success',
      tramites
    });
} catch (error) {
  console.error(error);
    res.status(500).json({ msg: 'Error al buscar el tramite' });
}
};

const cargarTramite = async (req, res) => {
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
          //Leer el archivo atraves del buffer
          //SINO TIENE ESPACIOS, NULL , VACIO. == NULL
        const workbook = xlsx.readFile(uploadPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Convertir los datos a JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
/////////////////////////////////////////////////////////////////////

        console.log(jsonData)

        res.status(200).json({ 
                    status: 'success',
                    msg: 'File uploaded to ' + uploadPath
                    });
    });
       } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar al cargar el tramite' });
       }
};

const crearTramite = async (req, res) => {
  try {
    const tramite = Tramite(req.body);
    const response = await tramite.save();
    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear el trámite",
      error: error.message,
    });
  }
}; 

const mostrarTramite = async(req, res) =>{

  try {
      const tramite = await Tramite.find();

      res.status(200).json({
          status: "success",
          data: tramite,
      })
  } catch (error) {
      res.status(500).json({
          msg: "Error al mostrar los registros"
      })
  }

};

module.exports ={
    actualizarTramite,
    borrarTramite,
    borrarAllTramite,
    buscarTramite,
    cargarTramite,
    crearTramite,
    mostrarTramite
  
}