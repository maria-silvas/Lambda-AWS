const users = require('./../db/users.json')
const JWT_KEY = process.env.JWT_KEY
const { sign } = require('jsonwebtoken')

const login = async event => {
    console.log('Login invoked!..', new Date().toISOString(), event.body)

    // Extrai o nome de usuário e senha do corpo da solicitação
    const {
        username,
        password
    } = JSON.parse(event.body)

    // Realiza as validações necessárias (não especificadas no código fornecido)

    // Procura pelo usuário válido nos dados armazenados (users)
    const validUser = users.find(
        user =>
            user.username.toLowerCase() === username.toLowerCase() &&
            user.password === password
    )

    // Se o usuário não for válido, retorna uma resposta com status 401 (não autorizado)
    if (!validUser) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: 'Unauthorized'
            })
        }
    }

    // Prepara os dados do usuário para assinar o token JWT
    const signUser = {
        scopes: validUser.scopes,
        username: validUser.username
    }

    // Gera um token JWT com uma chave JWT (JWT_KEY) e um tempo de expiração de 5 minutos
    const token = sign({
        user: signUser
    }, JWT_KEY, { expiresIn: '5m' })

    // Retorna uma resposta com status 200 e o token JWT no corpo da resposta
    return {
        statusCode: 200,
        body: JSON.stringify({
            token
        })
    }
}

// Exporta a função "login" como o manipulador da função Lambda
exports.handler = login;
