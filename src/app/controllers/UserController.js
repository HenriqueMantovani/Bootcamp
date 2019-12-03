import * as Yup from 'yup'; // usa "* as" pq o yup não tem um export
import User from '../models/User';

class UserController {
  // Cadastro de usuário
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    console.log('Teste Docker: User!');

    // Ver se o req.body esta passando igual ao schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Procura pelo "email" se ja existe um usuário cadastrado
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User alredy exists.' });
    }

    // cria o usuário e guarda apenas id, name e email para retornar ao frontend
    const { id, name, email, provider } = await User.create(req.body);

    // Retorna um Objeto com essa Info
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      // campo de confirmação da nova senha
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // Ver se o req.body esta passando igual ao schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // Vai busca o email e oldPassword de dentro do req body
    const { email, oldPassword } = req.body;

    // Busca user dentro do BD
    const user = await User.findByPk(req.userId);

    // Verifica se o email que ele passou ja não existe no BD
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User alredy exists.' });
      }
    }

    // Só cai no if se oldPassword não estiver vázio
    // Verifica se o oldPassword bate com a senha que ele ja tem
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
