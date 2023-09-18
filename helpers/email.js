const nodemailer = require('nodemailer');
const ResponseError = require('../utils/ResponseError');

const emailRegistro = async (datos) =>{
    const { correo, nombre, token } = datos;

    try {

      const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        }
      });

      const confirmarUrl = `${process.env.BASE_URL}/confirmar/${token}`;

      //Información del email
      const info = await transport.sendMail({
        from: '"IKTAN-Tramites" <iktanstrategies@iktanst.com>',
        to: correo,
        subject: "IKTAN - Comprueba tu cuenta",
        text: "Comprueba tu cuenta en IKTAN",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en IKTAN</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:

        <a href="${confirmarUrl}">Comprobar cuenta</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        
        `,
      })
    } catch (ex) {
      const response = new ResponseError(
        'fail',
        'Error al enviar el correo del registro mediante Desarrollo',
        ex.message,
      []).responseApiError();

       // Devolver la respuesta de error utilizando tu clase ResponseError
       return response.responseApiError();
    }
}


const emailOlvidePassword = async (datos) =>{
  const { correo, nombre, token } = datos;

  try {
  const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      }
    });

    const olvideUrl = `${process.env.BASE_URL}/olvide-password/${token}`;

    //Información del email
    const info = await transport.sendMail({
      from: '"IKTAN-Tramites" <iktanstrategies@iktanst.com>',
      to: correo,
      subject: "IKTAN - Restablece tu password",
      text: "Restablece tu password",
      html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>
      <p>Sigue el siguiente enlace para generar un password:

      <a href="${olvideUrl}">Reestablecer Password</a>

      <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
      
      `,
    })
  } catch (ex) {
    const response = new ResponseError(
      'fail',
      'Error al enviar el correo de olvidePassword mediante Desarrollo',
      ex.message,
    []).responseApiError();

     // Devolver la respuesta de error utilizando tu clase ResponseError
     return response.responseApiError();
  }
}


module.exports ={ emailRegistro, emailOlvidePassword };