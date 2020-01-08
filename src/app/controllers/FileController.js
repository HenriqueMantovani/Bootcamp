import File from '../models/File';

// Teste SSh

class FileController {
  async store(req, res) {
    // originalname é o nome como estava na máquina do user. e no BD vai salvar como name
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
