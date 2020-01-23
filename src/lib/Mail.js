import nodemailer from 'nodemailer';
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
