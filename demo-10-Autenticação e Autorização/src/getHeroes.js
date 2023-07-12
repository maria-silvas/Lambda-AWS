'use strict';

// Rota pública
module.exports.public = async (event) => {
console.log('Requesting public route...', new Date().toISOString());

const response = {
statusCode: 200,
body: JSON.stringify([
{
id: 1,
name: "Flash",
power: "Speed"
}
], null, 2)
};

return response;
};

// Rota privada
module.exports.private = async (event) => {
console.log('Requesting private route...', new Date().toISOString());

const user = JSON.parse(event.requestContext.authorizer.user);
console.log({ 'User': user });

const response = {
statusCode: 200,
body: JSON.stringify([
{
id: 100,
name: "Batman",
power: "Rich"
}
], null, 2)
};

return response;
};

//Principais melhorias:

//Adicionei comentários para explicar a função de cada rota.

//Atribuí a resposta em um objeto response antes de retorná-la. Isso torna o código mais legível e facilita possíveis modificações futuras.

//Acessamos diretamente a propriedade authorizer.user do objeto event.requestContext, sem a necessidade de chamar JSON.parse várias vezes.
