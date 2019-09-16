import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  // Onde vai cadastrar todos os middlewares
  middlewares() {
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
  }
}

export default new App().server;
