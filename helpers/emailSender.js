const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.KEYSENDGRID);

const emailRegistroP = async (datos) => {
  const { correo, nombre, token } = datos;

  const msg = {
    to: correo,
    from: 'iktanstrategies@iktanst.com',
    subject: 'IKTAN - Comprueba tu cuenta',
    text: 'Comprueba tu cuenta en IKTAN',
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en IKTAN</p>
      <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace:</p>
      <a href="http://localhost:5173/login/confirmar/${token}">Comprobar cuenta</a>
      <p>Si tú no creaste esta cuenta, puedes ignorar el mensaje</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Correo de confirmación enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo de confirmación:', error);
  }
};

const emailOlvidePasswordP = async (datos) => {
  const { correo, nombre, token } = datos;

  const msg = {
    to: correo,
    from: 'iktanstrategies@iktanst.com',
    subject: 'IKTAN - Restablece tu password',
    text: 'Restablece tu password',
    html: `<p>Hola: ${nombre} has solicitado restablecer tu contraseña</p>
      <p>Sigue el siguiente enlace para generar una nueva contraseña:</p>
      <a href="http://localhost:5173/login/olvide-password/${token}">Restablecer Contraseña</a>
      <p>Si tú no solicitaste este correo, puedes ignorar el mensaje</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Correo de restablecimiento de contraseña enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
  }
};

module.exports = { emailRegistroP, emailOlvidePasswordP };
