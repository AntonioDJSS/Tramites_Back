const puppeteer = require('puppeteer');
const fs = require('fs'); // Agrega el módulo fs para trabajar con archivos
const ResponseError = require('../utils/ResponseError')
const mongoose = require('mongoose');
const Tramite = require('../models/tramite')

const generarPdf = async (req, res) => {
    const { id } = req.params;

    //Validamos id existente
    if (!id) {
        const response = new ResponseError(
            'fail',
            'Id del tramite no existe',
            'Ingresa porfavor el ID del tramite',
            []).responseApiError();
        return res.status(400).json(response)
    }

    // Validar si el ID es un ObjectId válido de MongoDB
    if (!mongoose.isValidObjectId(id)) {
        const response = new ResponseError(
            'fail',
            'ID inválido',
            'El ID proporcionado no es válido en la Base de Datos',
            []
        ).responseApiError();

        return res.status(400).json(response);
    }
    const tramite = await Tramite.findOne({ _id: id });
    console.log(tramite.tramites[0].valor)

    try {
        const browser = await puppeteer.launch({ headless: "new" }); // Cambio aquí, Nos estamos preperando para las futuras actualizaciones en los navegadores
        const page = await browser.newPage();
        const htmlContent = `
        
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
                    <style>
                    * {
                        font-family: Arial, sans-serif;
                    }
    
                    body {
                        margin: 0;
                        font-family: Arial, sans-serif;
                    }

                    p {
                        margin: 0;
                        padding: 0;
                    }
            
                    .header {
                        display: flex;
                        width: 99%;
                        align-items: center;
                        border: 1px solid #000;
                    }

                    .header2 {
                        display: flex;
                        width: 99%;
                        align-items: center;
                        border: 1px solid #000;
                        border-top: none; 
                    }
            
                    .logo {
                        flex-basis: 20%;
                    }
            
                    .logo img {
                        width: 100%;
                        height: auto;
                    }
            
                    .title {
                        flex-basis: 55%;
                        text-align: center;
                        font-size: 10px; 
                        line-height: 8px; 
                    }
            
                    .info {
                        flex-basis: 25%;
                        display: flex;
                        flex-direction: column; 
                    }
            
                    .info-item {
                        flex-basis: 30%;
                        text-align: center;
                        display: flex;
                        font-size: 10px; 
                        line-height: 15px; 
                        justify-content: center;
                    }
                    </style>
                </head>


                <body>
                <div class="header">
                    <div class="logo">
                        <img src="https://iktanstrategies.com/LogoStrategies.png" alt="Logo">
                    </div>

                    <div class="title">
                        <h1>Trámite para Contrato Petrolero</h1>
                    </div>

                    <div class="info">
                        <div class="info-item">
                            <p>Id:</p>
                            <p>1</p>
                        </div>
                        <div class="info-item">
                            <p>Autoridad:</p>
                            <p>CNDH</p>
                        </div>
                        <div class="info-item">
                            <p>Revision:</p>
                            <p>25/01/23</p>
                        </div>
                    </div>
                </div>


                <div class="header2" >
                    <div style="flex-basis: 15%; font-size: 10px; margin: 0px; line-height: 15px;   ">
                        <p style="border: 1px solid #000;">Trámite: </p>
                        <p style="border: 1px solid #000;">Regulación: </p>
                        <p style="border: 1px solid #000;">Formato: </p>
                    </div>
                    <div style="flex-basis: 55%; font-size: 10px; margin: 0px; line-height: 15px;  ">
                        <p style="border: 1px solid #000;"> ${ tramite.tramites[24].valor } </p>
                        <p style="border: 1px solid #000;"> ${ tramite.tramites[15].valor } </p>
                        <p style="border: 1px solid #000;"> ${ tramite.tramites[27].valor } </p>
                    </div>
                    <div style="flex-basis: 15%; font-size: 10px; margin: 0px; line-height: 15px; ">
                        <p style="border: 1px solid #000;">Tipo: </p>
                        <p style="border: 1px solid #000;">Homoclave: </p>
                        <p style="border: 1px solid #000;"> </p>
                    </div>
                    <div style="flex-basis: 15%; font-size: 10px; margin: 0px; line-height: 15px; ">
                        <p style="border: 1px solid #000;"> ${ tramite.tramites[0].valor } </p>
                        <p style="border: 1px solid #000;"> ${ tramite.tramites[26].valor } </p>
                        <p style="border: 1px solid #000;">  </p>
                    </div>
                </div>



                <div style="display: flex; flex-direction: row; width: 99%; align-items: center; border: 1px solid #000;
                border-top: none; font-size: 10px;">
                    <div style="display: flex; flex-basis: 50%; flex-direction: row; width: 50%; ">
                        <p style="flex-basis: 50%; border-right: 1px solid #000;">¿Genera Resolución?</p>
                        <p style="flex-basis: 50%; border-right: 1px solid #000;">Si</p>
                    </div>

                    <div style="display: flex; flex-basis: 50%; flex-direction: row; width: 50%;">
                        <p style="flex-basis: 50%; border-right: 1px solid #000;">Resolucion: </p>
                        <p style="flex-basis: 50%;">Los avisos no generan una resolución </p>
                    </div>
                </div>



                <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000;
                border-top: none;">
                    <p style="flex-basis: 50%; border-right: 1px solid #000;">Plazo para presentar </p>
                    <p style="flex-basis: 50%;">${ tramite.tramites[30].valor }</p>
                </div>

                


                <div style="display: flex; flex-direction: row;  width: 99%; font-size: 10px; border: 1px solid #000;
                border-top: none; ">
                    <div style="flex-basis: 25%; border-right: 1px solid #000;">
                        <p style="border-bottom: 1px solid #000;">Sujeto a Respuesta</p>
                        <p style="border-bottom: 1px solid #000;">Fecha de Ingreso</p>
                        <p style="border-bottom: 1px solid #000;">Fecha Maxima de Resolucion</p>
                        <p style="border-bottom: 1px solid #000;">Fecha Minima de Resolucion</p>
                        <p style="border-bottom: 1px solid #000;">Plazo de Prevencion</p>
                        <p style="border-bottom: 1px solid #000;">Plazo para respuesta de Prevencion</p>
                        <p style="border-bottom: 1px solid #000;">Plazo de Respuesta de la Autoridad</p>
                        <p >Plazo Maximo de Respuesta</p>
                    </div>
                    
                    <div style="flex-basis: 25%; border-right: 1px solid #000;">
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[31].valor }</p>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[38].valor }</p>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[39].valor }</p>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[40].valor }</p>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[41].valor }</p>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[42].valor }</p>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[43].valor }</p>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[44].valor }</p>
                    </div>
                    
                    <div style="flex-basis: 25%; border-right: 1px solid #000;">
                        <p> Imagen con los Tiempos de la Tabla </p>
                    </div>

                    <div style="flex-basis: 25%; border-right: 1px solid #000;">
                        <p style="border-bottom: 1px solid #000;">Tiene Monto de Derechos o Aprovechamientos?</p>
                        <p style="border-bottom: 1px solid #000;">Nombre del Aprovechamiento</p>
                        <p style="border-bottom: 1px solid #000;">Monto mxn 2020</p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                    </div>

                    <div>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[33].valor }</p>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[34].valor }</p>
                        <p style="border-bottom: 1px solid #000;">${ tramite.tramites[45].valor }</p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                    </div>
                </div>

                <div>
                    <div style="display: flex; flex-direction: row;">
                        <p style="flex-basis: 25%;">Detonante: </p>
                        <p style="flex-basis: 25%;">${ tramite.tramites[19].valor }</p>
                        <p style="flex-basis: 25%;">Presentación: </p>
                        <p style="flex-basis: 25%;">${ tramite.tramites[23].valor }</p>
                    </div>
                </div>

    
            </body>
  </html>
        
        `; // Obtén el contenido HTML de la vista

        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ 
            format: 'A4',
            margin: {
                top: '1cm',
                right: '1cm',
                bottom: '1cm',
                left: '1cm'
            } });

        await browser.close();

        const filePath = `upload/example.pdf`; // Ruta donde se guardará el PDF en la carpeta "utils"
        fs.writeFileSync(filePath, pdfBuffer); // Guarda el PDF en el archivo

        res.status(200).send('PDF generado y guardado en carpeta.');
    } catch (ex) {
        console.log(ex)
        res.status(500).send('Error generando el PDF');
    }
};

module.exports = {
    generarPdf
};