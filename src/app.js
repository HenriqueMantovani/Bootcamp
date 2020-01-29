import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import Youch from 'youch';
import path from 'path';
import * as Sentry from '@sentry/node';
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  // Onde vai cadastrar todos os middlewares
  middlewares() {
    // Tem q ficar antes de todas as requisições
    this.server.use(Sentry.Handlers.requestHandler());

    // Avisando o Express que vamos usar Json no corpo da requisição
    this.server.use(express.json());

    // servir arquivos staticos, q podem ser acessados diretamente pelo browser
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  // middleware de tratamento de exceção
  exceptionHandler() {
    // Express entende que quando um middleware recebe 4 parametros, é pq esse middleware
    // para tratamento de execão
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'developments') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
