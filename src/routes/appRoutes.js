const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { profileSchema } = require('../models/profilValidation');
const Profile = require('../models/profile');
const dependencies = require('./routesDependencies').default;
const utils = require('../helpers/utils');

router.post('/addProfile', dependencies.authToken.authToken, async (req, res) => {
  try {

    const { 
      userId, 
      name,
      displayName,
      gender,
      age,
      mobile_number 
    } = req.body;
    
    // Validate the user request
    const result = await profileSchema.validate(req.body);
    if (result.error) {
      let errMsg = result.error.details[0].message;
      res.send(utils.responseMsg(errMsg));
    } 

    // Check if displayName is present in db.
    const isUser = await Profile.findOne({ $or: [{displayName: displayName}, {mobile_number: mobile_number}]  })
    if (isUser) {
      let errMsg = 'Please try with another display name and/or change your mobile number.';
      res.status(404).send(utils.responseMsg(errMsg));
    } else {
      const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      const userDetails = await Profile.create({ 
        userId: token.userID,
        name,
        displayName,
        gender,
        age,
        mobile_number 
      });
      let message = { 'msg': `user's Profile Added.` };
      res.send(utils.responseMsg(null, true, message));
    }
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
});

module.exports = router;
