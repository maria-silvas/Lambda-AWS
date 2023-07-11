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
