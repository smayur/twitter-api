//Third Party Modules
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenvFlow = require('dotenv-flow');
const passport = require('passport');

dotenvFlow.config();
console.log(' Current Environment ===>', process.env.NODE_ENV);

//Local Modules
const utils = require('./src/helpers/utils');
const {
  errorMessages
} = require('./src/helpers/errorMessage');
const config = require('./src/config/config');
const routes = require('./src/routes/routes');

/* Passport.js initialization */
passport.initialize();

require('./src/requireAllModels');

const app = express();

/* Configuring port */
app.set('port', process.env.PORT || 8000);

/* Importing database connection when server starts **/
require('./src/config/dbConfig');

/**
 * @name Swagger Documentation
 * @description This is used for API documentation. It's not mandatory 
 *  */
const swaggerDefinition = config.swaggerDefinition;
const swaggerOptions = config.swaggerOptions;
const options = {
  swaggerDefinition,
  'apis': ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));


/* Parsing Request Limits */
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  'limit': '50mb',
  'extended': true
}));


/* Configuring Routes */
app.use('/api', routes);

/* Handling invalid route */
app.use('/', function (req, res) {
  res.status(404).send(utils.responseMsg(errorMessages.routeNotFound));
});

/**
 * Listening to port
 */
app.listen(app.get('port'), () => {
  console.log(`Find the server at port:${app.get('port')}`);
});

module.exports = app;