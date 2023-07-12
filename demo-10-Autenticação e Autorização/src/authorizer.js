const jwt = require('jsonwebtoken');
const { buildIAMPolicy } = require('./lib/util');

const myRoles = {
  // Mapeamento de nome da função para nome da permissão
  'heroes:list': 'private'
};

const authorizeUser = (userScopes, methodArn) => {
  return userScopes.find(scope => methodArn.includes(myRoles[scope]));
};

const handleError = (statusCode, message) => {
  return {
    statusCode,
    body: JSON.stringify({
      error: message
    })
  };
};

exports.handler = async (event) => {
  const token = event.authorizationToken;

  try {
    // Verifica se um token está presente na solicitação
    if (!token) {
      return handleError(401, 'Token not provided');
    }

    // Verifica a autenticidade e integridade do token JWT usando a chave JWT
    const decodedUser = jwt.verify(token, process.env.JWT_KEY);

    // Obtém os detalhes do usuário do token decodificado
    const user = decodedUser.user;
    const userId = user.username;

    // Verifica se o usuário tem permissão para acessar o método ARN especificado
    const isAllowed = authorizeUser(user.scopes, event.methodArn);

    // Define o contexto do autorizador para ser enviado nas requisições
    const authorizerContext = {
      user: JSON.stringify(user)
    };

    // Constrói a política IAM com base nas permissões do usuário
    const policyDocument = buildIAMPolicy(
      userId,
      isAllowed ? 'Allow' : 'Deny',
      event.methodArn,
      authorizerContext
    );

    // Retorna a política IAM como resposta da função Lambda
    return policyDocument;
  } catch (error) {
    console.log('auth error:', error.stack);

    // Retorna uma resposta de erro com status 401 e uma mensagem de erro adequada
    return handleError(401, 'Unauthorized');
  }
};
