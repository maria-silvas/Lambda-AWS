const users = require('./../db/users.json');
const JWT_KEY = process.env.JWT_KEY;
const { sign } = require('jsonwebtoken');

const generateToken = (user) => {
  const signUser = {
    scopes: user.scopes,
    username: user.username
  };

  return sign({ user: signUser }, JWT_KEY, { expiresIn: '5m' });
};

const login = async (event) => {
  console.log('Login invoked!..', new Date().toISOString(), event.body);

  // Extrai o nome de usuário e senha do corpo da solicitação
  const { username, password } = JSON.parse(event.body);

  // Verifica se o nome de usuário e a senha foram fornecidos
  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Username and password are required'
      })
    };
  }

  // Procura pelo usuário válido nos dados armazenados (users)
  const authenticatedUser = users.find(
    (user) =>
      user.username.toLowerCase() === username.toLowerCase() &&
      user.password === password
  );

  // Se o usuário não for válido, retorna uma resposta com status 401 (não autorizado)
  if (!authenticatedUser) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Unauthorized'
      })
    };
  }

  // Gera um token JWT com base nos dados do usuário autenticado
  const token = generateToken(authenticatedUser);

  // Retorna uma resposta com status 200 e o token JWT no corpo da resposta
  return {
    statusCode: 200,
    body: JSON.stringify({
      token
    })
  };
};

// Exporta a função "login" como o manipulador da função Lambda
exports.handler = login;

//Nesta versão aprimorada, adicionei a validação para garantir que o nome de usuário e a senha sejam fornecidos na solicitação. 
//Caso contrário, uma resposta de erro com status HTTP 400 (Bad Request) será retornada.
