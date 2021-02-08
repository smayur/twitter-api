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
      return res.send(utils.responseMsg(errMsg));
    } 

    // Check if displayName is present in db.
    const isUser = await Profile.findOne({ $or: [{displayName: displayName}, {mobile_number: mobile_number}]  })
    if (isUser) {
      let errMsg = 'Please try with another display name and/or change your mobile number.';
      return res.status(403).send(utils.responseMsg(errMsg));
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
      return res.send(utils.responseMsg(null, true, message));
    }
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
});

// Fetch user's profile
router.get('/showProfile', dependencies.authToken.authToken, async (req, res) => {
  try {
    const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    Profile.findOne(
      { userId: token.userID },
      (err, user) => {
        if (err) {
          res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
        } else if (!user) {
          res.status(404).send(utils.responseMsg(errorMsg.noDataExist));
        } else {
          let message = { 
            'msg': `user's Profile Deleted.`,
            'UserData': user
          };
          return res.send(utils.responseMsg(null, true, message));
        }
      }
    );
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
});


// Update user's profile
router.put('/updateProfile', dependencies.authToken.authToken, async (req, res) => {
  try {

    const { 
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
      return res.send(utils.responseMsg(errMsg));
    } 

    const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    Profile.findOneAndUpdate(
      { userId: token.userID },
      { $set: 
        { 
          userId: token.userID,
          name: name,
          displayName: displayName,
          gender: gender,
          age: age,
          mobile_number: mobile_number
        }
      },
      (err, updateUser) => {
        if (err) {
          res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
        } else if (!updateUser) {
          res.status(404).send(utils.responseMsg(errorMsg.noDataExist));
        } else {
          let message = { 
            'msg': `user's Profile Updated.`
          };
          return res.send(utils.responseMsg(null, true, message));
        }
      }
    );
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
});


// Delete user's profile
router.delete('/deleteProfile', dependencies.authToken.authToken, async (req, res) => {

  try {
    const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    Profile.findOneAndRemove(
      { userId: token.userID },
      (err, deleUser) => {
        if (err) {
          res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
        } else if (!deleUser) {
          res.status(404).send(utils.responseMsg(errorMsg.noDataExist));
        } else {
          let message = { 'msg': `user's Profile Deleted.` };
          return res.send(utils.responseMsg(null, true, message));
        }
      }
    );
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }

});

module.exports = router;
