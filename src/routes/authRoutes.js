const router = require('express').Router();
const dependencies = require('./routesDependencies').default;

/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *      - Authentication
 *    name: Local Login API
 *    summary: Based on user's data, this api sent jwt token which leads to login process.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          username: 
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - username
 *         - password
 *    responses:
 *      200:
 *        description: JWT token will be in response.
 *      500:
 *        description: Internal server error.
 */
router.post('/login', dependencies.authClient.login);

/**
 * @swagger
 * /auth/logout:
 *  post:
 *    tags:
 *      - Authentication
 *    name: Local logout API
 *    summary: This api destory/delete jwt token from cookie which leads to logout process.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: logout Successful.
 *      500:
 *        description: Internal server error.
 */
router.post('/logout', dependencies.authClient.logout);

/**
 * @note All routes regarding local signup OR using Oauth sign-in should be listed below. 
 */

/**
 * @swagger
 * /auth/signup:
 *  post:
 *    tags:
 *      - Authentication
 *    name: Local signup API
 *    summary: Based on user's data, this api create new user.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          username: 
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - username
 *         - password
 *    responses:
 *      200:
 *        description: signup Successful.
 *      500:
 *        description: Internal server error.
 */
router.post('/signup', dependencies.authClient.signup);

module.exports = router;
