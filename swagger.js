const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Recipes API',
        description: 'API for managing and retrieving healthy recipes'
    },
    host: 'localhost:3000',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/recipes.js']; // Added recipes.js

// This will generate swagger.json 
swaggerAutogen(outputFile, endpointsFiles, doc);
