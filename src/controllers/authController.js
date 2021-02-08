const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { userSchema } = require('../models/userValidation');
const User = require('../models/user');
const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');

// dureation for jwt cookie
const maxAge = 1 * 24 * 60 * 60;

/**
 * @description Local login controller.
 * @function login
 */
exports.login = async (req, res) => {
  try {

    const { username, password } = req.body;
    
    // Validate the user request
    const result = await userSchema.validate(req.body);
    if (result.error) {
      let errMsg = result.error.details[0].message;
      return res.send(utils.responseMsg(errMsg));
    } 

    // Check if username is present in db.
    const isUser = await User.findOne({ username: username })
    if (!isUser) {
      let errMsg = 'User not found';
      res.status(404).send(utils.responseMsg(errMsg));
    } else {
      // if present, compare with hash passowrd.
      if (await bcrypt.compare(password, isUser.password)) {
        // If passaword match, sign JWT token.
        const userInfo = { userID: isUser._id, userName: isUser.username};
        const accessToken = jwt.sign(userInfo, process.env.JWT_SECRET);
        res.cookie('jwt', accessToken, { maxAge: maxAge * 1000 });
        let message = {
          'msg': 'Login Successful.',
          'token': accessToken
        };
        return res.send(utils.responseMsg(null, true, message));
      } else {
        let errMsg = 'Please check your credentials';
        res.status(403).send(utils.responseMsg(errMsg));
      }
    }
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
};


/**
 * @description Local signup controller.
 * @function signup
 */
exports.signup = async (req, res) => {
  try {

    const { username, password } = req.body;

    const result = await userSchema.validate(req.body);
    if (result.error) {
      let errMsg = result.error.details[0].message;
      return res.send(utils.responseMsg(errMsg));
    } 

    // Check is user already exists in our db
    let existingUser = await User.findOne({username: username});
    if (existingUser) {
      // if user already present in db
      res.status(500).send(utils.responseMsg(errorMsg.duplicateDataProvided));
    } else {
      // else create new user
      const userDetails = await User.create({ username, password });
      let message = { 'msg': 'signup Successful.' };
      res.send(utils.responseMsg(null, true, message));
    }
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
};


/**
 * @description Local logout controller.
 * @function logout
 */
exports.logout = async (req, res) => {
  try {
    res.clearCookie('jwt');
    let message = { 'msg': 'logout Successful.' };
    res.send(utils.responseMsg(null, true, message));
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
};