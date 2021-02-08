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
 *          email: 
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - email
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
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          email: 
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - email
 *         - password
 *    responses:
 *      200:
 *        description: JWT token will be in response.
 *      500:
 *        description: Internal server error.
 */
router.post('/logout', dependencies.authClient.logout);

/**
 * @note All routes regarding local signup OR using Oauth sign-in should be listed below. 
 */

router.post('/signup', dependencies.authClient.signup);

module.exports = router;
