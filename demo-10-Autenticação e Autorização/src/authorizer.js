const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.JWT_KEY
const { buildIAMPolicy } = require('./lib/util')

const myRoles = {
    // role name vs function name
    'heroes:list': 'private'
}

const authorizeUser = (userScopes, methodArn) => {
    return userScopes.find(
        scope => ~methodArn.indexOf(myRoles[scope])
    )
}

exports.handler = async event => {
    const token = event.authorizationToken;

    try {
        // Verifica a autenticidade e integridade do token JWT usando a chave JWT
        const decodedUser = jwt.verify(token, JWT_KEY)
        
        // Obtém os detalhes do usuário do token decodificado
        const user = decodedUser.user
        const userId = user.username
        
        // Verifica se o usuário tem permissão para acessar o método ARN especificado
        const isAllowed = authorizeUser(user.scopes, event.methodArn)

        // Define o contexto do autorizador para ser enviado nas requisições
        const authorizerContext = {
            user: JSON.stringify(user)
        }

        // Constrói a política IAM com base nas permissões do usuário
        const policyDocument = buildIAMPolicy(
            userId,
            isAllowed ? 'Allow' : 'Deny',
            event.methodArn,
            authorizerContext
        )

        // Retorna a política IAM como resposta da função Lambda
        return policyDocument;
    } catch (error) {
        console.log('auth error**', error.stack)
        
        // Se ocorrer um erro, retorna uma resposta com status 401 e o stack trace do erro no corpo da resposta
        return {
            statusCode: 401,
            body: error.stack
        }
    }
}
