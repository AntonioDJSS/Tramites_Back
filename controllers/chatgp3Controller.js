const axios = require('axios');

const chatgp3 = async (req, res) => {
    const { pregunta } = req.body;

    // Definir tu clave de API
    const api_key = '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';

    // Establecer el encabezado de autorización para la solicitud a la API
    const headers = {
        Authorization: `Bearer ${api_key}`,
        'Content-Type': 'application/json'
    };

    try {
        // Hacer una solicitud a la API de OpenAI para obtener la respuesta
        const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            prompt: pregunta,
            temperature: 0.7,
            max_tokens: 150
        }, { headers });

        const respuesta_chatgpt = response.data.choices[0].text.trim();
        
        res.status(200).json({
            status: 'successful',
            respuesta: respuesta_chatgpt
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la solicitud a la API
        console.error("Error:", error.message);
        res.status(500).json({
            status: 'error',
            message: 'Error al procesar la solicitud.'
        });
    }
};

module.exports = {
    chatgp3
};