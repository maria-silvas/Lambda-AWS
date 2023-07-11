'use strict';

// Rota pública
module.exports.public = async event => {
    console.log(
        'Requesting public route...', new Date().toISOString()
    )

    // Retorna uma resposta com status 200 e um array de objeto JSON como corpo da resposta
    return {
        statusCode: 200,
        body: JSON.stringify(
            [
                {
                    id: 1,
                    name: "Flash",
                    power: "Speed"
                }
            ],
            null,
            2
        ),
    };
};

// Rota privada
module.exports.private = async event => {

    console.log(
        'Requesting private route...', new Date().toISOString()
    )
    console.log(
        {
            'User': JSON.parse(
                event.requestContext.authorizer.user
            )
        }
    )

    // Retorna uma resposta com status 200 e um array de objeto JSON como corpo da resposta
    return {
        statusCode: 200,
        body: JSON.stringify(
            [
                {
                    id: 100,
                    name: "Batman",
                    power: "Rich"
                }
            ],
            null,
            2
        ),
    };
};
//Neste código, temos duas funções exportadas: public e private, que representam rotas públicas e privadas, respectivamente.

//A função public é uma rota pública que imprime uma mensagem de log indicando a solicitação da rota e retorna uma resposta com status 200 e um array JSON no corpo da resposta.

//A função private é uma rota privada que imprime uma mensagem de log indicando a solicitação da rota, extrai os detalhes do usuário do objeto event (que contém o contexto da requisição) e retorna uma resposta com status 200 e um array JSON no corpo da resposta.

//Espero que isso esclareça o código para você. Se você tiver mais perguntas, fique à vontade para perguntar.
