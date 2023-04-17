const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Mentalist API',
    description: 'API used by the Mentalist app',
  },
  host: 'localhost:4000',
  schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./api.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);