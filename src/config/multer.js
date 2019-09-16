import multer from 'multer';
import crypto from 'crypto'; // gerar caracteres aleatórios e outras funcionalidades
import { extname, resolve } from 'path'; // retorna a externsao daquele arquivo (extname)

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // destino dos arquivos

    // Aqui sera formatado o nome do arquivo das imagens dos uploads dos usuários
    filename: (req, file, cb) => {
      // adiciona um código único no começo de cada imagem
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
