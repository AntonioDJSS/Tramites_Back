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
                        
                        font-family: Arial, sans-serif;
                    }

                    p {
                        margin: 0;
                        padding: 4px 0px 4px 3px; 

                    }
            
                    .header {
                        display: flex;
                        width: 99%;
                        align-items: center;
                        border: 1px solid #000;
                    }
                    </style>
                </head>


                <body>
                <div style="display: flex; flex-direction: row; align-items: center; width: 99%; border: 1px solid #000; font-size: 10px;">
                    <div style="flex-basis: 33.3%;  ">
                        <img width="45%" style="padding-left: 4px;" src="https://iktanstrategies.com/LogoStrategies.png" />
                    </div>

                    <div style="flex-basis: 36.7%; line-height: 0px;  ">
                        <h1> Tramite Petrolero </h1>
                    </div>

                    <div style="flex-basis: 30%; display: flex; flex-direction: column; width: 100%; height: 100%; ">
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 33.3%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9; "> Id: </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; "> ${ tramite.contadorTramites } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 33.3%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9;"> Autoridad: </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; "> ${ tramite.tramites[18].valor } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99% ; height: 33.3%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9;" > Revisión: </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000;"> ${ tramite.tramites[37].valor } </p>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000; ">
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;">Trámite: </p>
                        <p style="flex-basis: 55%; border-right: 1px solid #000;">${ tramite.tramites[24].valor }</p>
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;">Tipo:</p>
                        <p style="flex-basis: 15%; ">${ tramite.tramites[0].valor }</p>
                    </div>
                </div>

                <div>
                    <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000; border-top: none; ">
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;">Regulación: </p>
                        <p style="flex-basis: 55%; border-right: 1px solid #000;">${ tramite.tramites[15].valor }</p>
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;"> Homoclave:</p>
                        <p style="flex-basis: 15%; ">${ tramite.tramites[26].valor } </p>
                    </div>
                </div>

                <div>
                    <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000; border-top: none; ">
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;">Formato: </p>
                        <p style="flex-basis: 55%; border-right: 1px solid #000;">${ tramite.tramites[27].valor }</p>
                        <p style="flex-basis: 15%; border-right: 1px solid #000;"></p>
                        <p style="flex-basis: 15%; "> </p>
                    </div>
                </div>


                <div style="display: flex; flex-direction: row; width: 99%; align-items: center; border: 1px solid #000;
                font-size: 10px; margin-top: 20px;">
                    <div style="display: flex; flex-basis: 50%; flex-direction: row; width: 50%; ">
                        <p style="flex-basis: 50%; border-right: 1px solid #000; background-color: #D9D9D9;">¿Genera Resolución?</p>
                        <p style="flex-basis: 50%; border-right: 1px solid #000;">${ tramite.tramites[31].valor }</p>
                    </div>

                    <div style="display: flex; flex-basis: 50%; flex-direction: row; width: 50%;">
                        <p style="flex-basis: 50%; border-right: 1px solid #000; background-color: #D9D9D9;">Resolucion: </p>
                        <p style="flex-basis: 50%;">${ tramite.tramites[45].valor }</p>
                    </div>
                </div>

                <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000;
                border-top: none;">
                    <p style="flex-basis: 25%; border-right: 1px solid #000; background-color: #D9D9D9;">Plazo para presentar </p>
                    <p style="flex-basis: 75%;">${ tramite.tramites[30].valor }</p>
                </div>


                <div style="display: flex; flex-direction: row; align-items: center; width: 99%;  border: 1px solid #000; font-size: 10px; border-top: none; height: 300px; ">  
                    <div style="flex-basis: 30%; display: flex; flex-direction: column; width: 100%; height: 100%; ">
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 12%;">
                            <p style="flex-basis: 50%; background-color: #D9D9D9; "> Sujeto a Respuesta </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; border-right: 1px solid #000; "> ${ tramite.contadorTramites } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 12%;">
                            <p style="flex-basis: 50%; background-color: #D9D9D9;"> Fecha de Ingreso </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; border-right: 1px solid #000;"> ${ tramite.tramites[18].valor } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 12%;">
                            <p style="flex-basis: 50%; background-color: #D9D9D9;" > Fecha Maxima de Resolución </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; border-right: 1px solid #000;"> ${ tramite.tramites[37].valor } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 12%;">
                            <p style="flex-basis: 50%; background-color: #D9D9D9; "> Fecha Minima de Resolución </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; border-right: 1px solid #000; "> ${ tramite.contadorTramites } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 13%;">
                            <p style="flex-basis: 50%; background-color: #D9D9D9; "> Plazo de Prevención </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; border-right: 1px solid #000; "> ${ tramite.contadorTramites } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 13%;">
                            <p style="flex-basis: 50%; background-color: #D9D9D9; "> Plazo para respuesta a Prevención </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; border-right: 1px solid #000; "> ${ tramite.contadorTramites } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 13%;">
                            <p style="flex-basis: 50%; background-color: #D9D9D9; "> Plazo de Respuesta de la Autoridad </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; border-right: 1px solid #000; "> ${ tramite.contadorTramites } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 13%;">
                            <p style="flex-basis: 50%; background-color: #D9D9D9; "> Plazo Máximo de Respuesta </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; border-right: 1px solid #000; "> ${ tramite.contadorTramites } </p>
                        </div>
                    </div>

                    <div style="flex-basis: 40%; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; ">
                        <p>Aqui va una imagen</p>
                    </div>

                    <div style="flex-basis: 30%; display: flex; flex-direction: column; width: 100%; height: 100%; ">
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 12%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9; "> Tiene Monto de derechos o aprovechamientos </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; "> ${ tramite.contadorTramites } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 12%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9;"> Nombre del Aprovechamiento </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; "> ${ tramite.tramites[18].valor } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99% ; border-bottom: 1px solid #000; height: 33.3%; height: 12%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9;" > Monto mxn 2020 </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000;"> ${ tramite.tramites[37].valor } </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 12%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9; ">  </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; ">  </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 13%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9;">  </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; ">  </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99% ; border-bottom: 1px solid #000; height: 13%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9;" >  </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000;">  </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 13%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9; ">  </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; ">  </p>
                        </div>
                        <div style="flex-basis: 33%; display: flex; flex-direction: row; width: 99%; border-bottom: 1px solid #000; height: 13%;">
                            <p style="flex-basis: 50%; border-left: 1px solid #000; background-color: #D9D9D9;">  </p>
                            <p style="flex-basis: 50%; border-left: 1px solid #000; ">  </p>
                        </div>

                    </div>

                </div>          

                <div style="margin-top: 20px;">
                    <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000; ">
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;">Detonante: </p>
                        <p style="flex-basis: 56%; border-right: 1px solid #000;">${ tramite.tramites[19].valor }</p>
                        <p style="flex-basis: 14%; border-right: 1px solid #000; background-color: #D9D9D9;">Presentación: </p>
                        <p style="flex-basis: 15%; ">${ tramite.tramites[23].valor }</p>
                    </div>
                </div>

                <div>
                    <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000; border-top: none; ">
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;">Articulos: </p>
                        <p style="flex-basis: 56%; border-right: 1px solid #000;">${ tramite.tramites[17].valor }</p>
                        <p style="flex-basis: 14%; border-right: 1px solid #000; background-color: #D9D9D9;">Periodicidad: </p>
                        <p style="flex-basis: 15%; ">${ tramite.tramites[29].valor }</p>
                    </div>
                </div>

                <div>
                    <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000; border-top: none; ">
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;"> Regulacion (link): </p>
                        <p style="flex-basis: 56%; border-right: 1px solid #000;">${ tramite.tramites[46].valor }</p>
                        <p style="flex-basis: 14%; border-right: 1px solid #000;"> </p>
                        <p style="flex-basis: 15%; "></p>
                    </div>
                </div>

                <div>
                    <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000; border-top: none; ">
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;">Referencia: </p>
                        <p style="flex-basis: 56%; border-right: 1px solid #000;">${ tramite.tramites[47].valor }</p>
                        <p style="flex-basis: 14%; border-right: 1px solid #000;"></p>
                        <p style="flex-basis: 15%; "></p>
                    </div>
                </div>

                <div>
                    <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000; border-top: none; ">
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;">Comentarios: </p>
                        <p style="flex-basis: 56%; border-right: 1px solid #000;">${ tramite.tramites[36].valor }</p>
                        <p style="flex-basis: 14%; border-right: 1px solid #000;"> </p>
                        <p style="flex-basis: 15%; "> </p>
                    </div>
                </div>

                <div>
                    <div style="display: flex; flex-direction: row; width: 99%; font-size: 10px; border: 1px solid #000; border-top: none; ">
                        <p style="flex-basis: 15%; border-right: 1px solid #000; background-color: #D9D9D9;">Requisitos: </p>
                        <p style="flex-basis: 56%; border-right: 1px solid #000;">${ tramite.tramites[48].valor }</p>
                        <p style="flex-basis: 14%; border-right: 1px solid #000;"></p>
                        <p style="flex-basis: 15%; "> </p>
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
            },
            printBackground: true, //Con esta opción se habilita el color de fondo en el pdf
        });

        await browser.close();

        const filePath = `upload/example.pdf`; // Ruta donde se guardará el PDF en la carpeta "utils"
        fs.writeFileSync(filePath, pdfBuffer); // Guarda el PDF en el archivo

        res.status(200).json({
            status: 'sucessful',
            message: 'PDF generado y guardado en carpeta.'
        })

        
    } catch (ex) {
        const response = new ResponseError(
            'fail',
            'Error generando el PDF',
            ex.message,
            []).responseApiError();

        res.status(500).json(
            response
        )
    }
};

module.exports = {
    generarPdf
};