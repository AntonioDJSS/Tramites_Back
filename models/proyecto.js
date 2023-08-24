const { Schema, model, default: mongoose } = require('mongoose');

const ProyectoSchema = Schema({

    idt:{
        type: String,
        required: [true, 'El id del Tramite es obligatorio']
    },
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    descripcion:{
        type: String,
        maxlength: [250, 'La descripción no debe exceder los 250 caracteres']
    },
    empresa:{
        type: String,
        maxlength: [250, 'La descripción no debe exceder los 250 caracteres']
    },
    fechainicio:{
        type: String,
    },
    fechafin:{
        type: String,
    },
    estado:{
        type: String,
        maxlength: [250, 'La descripción no debe exceder los 250 caracteres']
    },
    usuario:{
        type: mongoose.Schema.ObjectId,
        required: [true, 'El Usuario es requerido para la creación del proyecto'],
        ref: 'Usuario'
    }
})

module.exports = model( 'Proyecto', ProyectoSchema  )