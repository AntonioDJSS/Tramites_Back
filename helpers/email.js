const nodemailer = require('nodemailer');

const emailRegistro = async (datos) =>{
    const { correo, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "b638011704600a",
          pass: "e7bc714da082be"
        }
      });

      //Información del email
      const info = await transport.sendMail({
        from: '"IKTAN-Tramites" <iktanstrategies@iktanst.com>',
        to: correo,
        subject: "IKTAN - Comprueba tu cuenta",
        text: "Comprueba tu cuenta en IKTAN",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en IKTAN</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:

        <a href="http://localhost:5173/login/confirmar/${token}">Comprobar cuenta</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        
        `,
      })
}


const emailOlvidePassword = async (datos) =>{
  const { correo, nombre, token } = datos;

  const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b638011704600a",
        pass: "e7bc714da082be"
      }
    });

    //Información del email
    const info = await transport.sendMail({
      from: '"IKTAN-Tramites" <iktanstrategies@iktanst.com>',
      to: correo,
      subject: "IKTAN - Restablece tu password",
      text: "Restablece tu password",
      html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>
      <p>Sigue el siguiente enlace para generar un password:

      <a href="http://localhost:5173/login/olvide-password/${token}">Reestablecer Password</a>

      <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
      
      `,
    })
}


module.exports ={ emailRegistro, emailOlvidePassword };