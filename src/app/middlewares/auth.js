import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // Pega uma função de callback e
//                                   transforma em uma função Usa o padrão "async await"

// Onde ta o segredo do token
import authConfig from '../../config/auth';

// Arquivo que verifica pelo token do JWT se o usuário está logado
export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Desestruturação para pegar apenas o token, sem o Bearer
  const [, token] = authHeader.split(' ');

  try {
    // No decoded vao estar as inf que se utilizou na hora de gerar o token
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
