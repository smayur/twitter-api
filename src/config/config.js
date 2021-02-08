let config = {};

/* mongodb connection configuration */
let noSqlDbConfig = { 
  url: process.env.DB_URL || 'mongodb://localhost:27017/',
  name: process.env.DB_NAME || 'twitter',
};

config.db = {
  noSqlDbConfig,
};

/* JWT Authentication Credentials  */
config.jwt = {
  secret: process.env.JWT_SECRET  || 'prdxn',
  expireIn: process.env.JWT_EXPIRE_IN || '1d',
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
};

config.client = process.env.CLIENT_URL || '*';

/* Swagger Definition */
config.swaggerDefinition = {
  info: {
    title: 'PRDXN Node API Boilerplate',
    version: '1.0.0',
    description: '',
  },
  host: process.env.HOST || 'localhost:8000',
  basePath: '/api',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};
config.swaggerOptions = {
  customSiteTitle: '[Project Title]',
  customCss: '',
  customfavIcon: '',
};

module.exports = config;
