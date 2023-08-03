// const axios = require('axios');
const ResponseError = require('../utils/ResponseError')
// const AWS = require('aws-sdk');


// Configura el AWS SDK con las credenciales y la región adecuada donde está ubicada tu función Lambda

// const chatgp3 = async (req, res) => {
//     const { pregunta } = req.body;

//     // Definir tu clave de API
//     const api_key = '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';

//     // Establecer el encabezado de autorización para la solicitud a la API
//     const headers = {
//         Authorization: `Bearer ${api_key}`,
//         'Content-Type': 'application/json'
//     };

//     try {
//         // Hacer una solicitud a la API de OpenAI para obtener la respuesta
//         const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
//             prompt: pregunta,
//             temperature: 0.7,
//             max_tokens: 150
//         }, { headers });

//         const respuesta_chatgpt = response.data.choices[0].text.trim();
        
//         res.status(200).json({
//             status: 'successful',
//             Data: respuesta_chatgpt,
//             message: 'Respuesta exitosa'
//         });
//     } catch (error) {
//         // Manejar cualquier error que pueda ocurrir durante la solicitud a la API
//         console.error("Error:", error.message);
//         res.status(500).json({
//             status: 'error',
//             message: 'Error al procesar la solicitud.'
//         });
//     }
// };

const awsConfig = require('../aws.config.json');
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { fromUtf8 } = require("@aws-sdk/util-utf8-node");

const lambdaClient = new LambdaClient({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey
  }
});

const chatgp3L = async (req, res) => {
  try {
    const prompt = JSON.stringify(req.body); // Convierte la pregunta a una cadena (string)

    console.log(prompt)

    // Configura el nombre de la función Lambda que deseas invocar
    const functionName = 'GPT-3_5';

    // Parámetros para la invocación de la función Lambda
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse', // La función se ejecuta de forma síncrona y retorna una respuesta
      Payload: JSON.stringify({ prompt: prompt }), // Pasa la pregunta como argumento a la función Lambda
    };

    // Invoca la función Lambda
    const command = new InvokeCommand(params);
    console.log(command)
   
    const lambdaResponse = await lambdaClient.send(command);
   console.log(lambdaResponse)
    
    // Extrae la respuesta de la función Lambda del campo "Payload" de la respuesta
    const respuesta = JSON.parse(fromUtf8(lambdaResponse.Payload));
    console.log(respuesta, 'respuesta')

    res.status(200).json({
      status: 'successful',
      data: respuesta,
    });
  } catch (ex) {
    console.log(ex)
    const response = new ResponseError(
      'fail',
      'Error al invocar la función Lambda',
      ex.message,
      []
    ).responseApiError();
    res.status(500).json(response);
  }
};

module.exports = {
    // chatgp3,
    chatgp3L
};