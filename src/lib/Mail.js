import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    // Compile é como ele compila os templates de email
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          // chegando na pasta 'layouts' / 'partials' /
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  // message vem do Controller, com os dados que vao no email
  sendMail(message) {
    return this.transporter.sendMail({
      // Joga tudo que tem no default e na message no email
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
