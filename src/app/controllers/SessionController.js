import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';

// Regex para validação de email
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    console.log('Teste Docker: Session');

    // Ver se o req.body esta passando igual ao schema
    if (!(await schema.isValid(req.body))) {
      if (req.body.email === '')
        return res.status(400).json({ Message: 'Digite um Email' });
      if (req.body.password === '')
        return res.status(400).json({ Message: 'Digite a Senha' });
      if (req.body.email && !validateEmail(req.body.email))
        return res.status(400).json({ Error: 'Email inserido Incorretamente' });
      return res.status(400).json({ Error: 'Campos inseridos Incorretamente' });
    }

    const { email, password } = req.body;

    // Procura se o email já esta cadastrado
    const user = await User.findOne({ where: { email } });

    // Se não existe
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // pega o id e name do user para retornar ao frontend
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
