const ResponseError = require('../utils/ResponseError')

const utf8 = require('utf8');

const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { fromUtf8 } = require("@aws-sdk/util-utf8-node");

const lambdaClient = new LambdaClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY
  }
});

const chatgp3L = async (req, res) => {
  try {
    const prompt = req.body.prompt; // Obtiene el prompt directamente como un string
    console.log(prompt, ' prompt');

    // Configura el nombre de la función Lambda que deseas invocar
    const functionName = 'GPT-3_5';

    // Parámetros para la invocación de la función Lambda
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse', // La función se ejecuta de forma síncrona y retorna una respuesta
      Payload: JSON.stringify({ prompt }), // Pasa el prompt como argumento a la función Lambda
    };

    // Invoca la función Lambda
    const command = new InvokeCommand(params);
    console.log(command, ' command');

    const lambdaResponse = await lambdaClient.send(command);
    console.log(lambdaResponse, ' lambdaResponse');


    // Decodificar los datos binarios usando TextDecoder
    const decoder = new TextDecoder('utf-8');
    const decodedPayload = decoder.decode(lambdaResponse.Payload);
    const respuesta = JSON.parse(decodedPayload);
    console.log(respuesta, 'respuesta (parsed JSON)');

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