const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:5000',
  schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./api.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);