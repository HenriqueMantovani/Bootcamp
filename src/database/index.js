import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointments';
import databaseConfig from '../config/database';

// Array com todos os models da app
const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // Vai Fazer a conexão com a base de dados e carregar os Models
  init() {
    this.connection = new Sequelize(databaseConfig); // conexao com BD

    // Percorrer o Array e passa a conexão para o Model
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
