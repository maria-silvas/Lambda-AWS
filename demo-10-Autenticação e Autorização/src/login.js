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


//Neste código, a função login é responsável por autenticar os usuários com base em um arquivo JSON de usuários (users.json).

//A função extrai o nome de usuário e a senha do corpo da solicitação recebida.
//Em seguida, ela valida as informações do usuário, comparando-as com os dados armazenados no arquivo users.json.
//Se o usuário não for válido, a função retorna uma resposta com status 401 (não autorizado).
//Se o usuário for válido, a função prepara os dados do usuário para assinar um token JWT.
//Em seguida, ela gera um token JWT usando a chave JWT (JWT_KEY) e um tempo de expiração de 5 minutos.
//Por fim, a função retorna uma resposta com status 200 e o token JWT no corpo da resposta.

