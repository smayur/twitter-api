const jwt = require('jsonwebtoken');

const utils = require('../helpers/utils');

// Verfiy token
exports.authToken = (req, res, next) => {
  const token = req.cookies.jwt;
  
  // Check JWT exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {
      if (err) {
        res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
      } else {
        console.log(decodeToken);
        return next()
      }
    })
  } else {
      let errMsg = 'Please login';
      res.status(403).send(utils.responseMsg(errMsg));
  }
}

