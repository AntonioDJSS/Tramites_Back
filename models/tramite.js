
const { Schema, model }= require('mongoose');

const TramiteSchema = Schema ({
  tramites: [
    {
      nombre: {
        type: String, 
        maxlength: [250, "El maximo de caracteres es: 250"],
        required: [true, "El campo nombre es requerido"],
        trim: true
      },
      valor: {
        type: String,
        maxlength: [250, "El maximo de caracteres es: 250"],
        trim: true,
        default: null 
      }
    }
  ], 
  createAt: {type: Date, default: new Date() } 
});


module.exports = model('Tramite', TramiteSchema )