const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const authService = require('../services/authServices');
const { userSchema } = require('../models/userValidation');
const User = require('../models/user');
const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');

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
        console.log(accessToken);
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
      let message = {
        'msg': 'signup Successful.'
      };
      res.send(utils.responseMsg(null, true, message));
    }
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
};