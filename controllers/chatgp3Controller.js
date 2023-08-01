// Importar la biblioteca 'openai'
const openai = require('openai');


// Definir la función 'chatgp3'
const chatgp3 = async (req, res) => {
  try {
    // Obtener la pregunta del cuerpo de la solicitud
    const { pregunta } = req.body;

     // Tu clave de API de OpenAI
     const api_key = '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';

     // Establecer la clave de API para la biblioteca
     openai.api_key = api_key;
 
     // Configurar los parámetros para la solicitud a la API de OpenAI
     const params = {
       engine: 'text-davinci-003',
       prompt: pregunta,
       temperature: 0.7,
       max_tokens: 150,
     };
 
     // Realizar la solicitud a la API de OpenAI
     const respuesta = await openai.Completion.create(params);
    // Obtener la respuesta del resultado y extraer el texto
    const respuesta_chatgpt = respuesta.data.choices[0].text.trim();

    // Responder con la respuesta del modelo ChatGPT
    res.status(200).json({
      status: 'successful',
      respuesta: respuesta_chatgpt,
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante la solicitud a la API
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  chatgp3,
};
