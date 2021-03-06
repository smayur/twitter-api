const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { profileSchema } = require('../models/profilValidation');
const Profile = require('../models/profile');
const { tweetSchema } = require('../models/tweetsValidation');
const Tweet = require('../models/tweets');
const errorMsg = require('../helpers/errorMessage').errorMessages;
const dependencies = require('./routesDependencies').default;
const utils = require('../helpers/utils');

// Add user profile
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


// Create Tweet
router.post('/addTweet', dependencies.authToken.authToken, async (req, res) => {
  try {

    const { 
      userId, 
      tweet,
      like,
      date 
    } = req.body;
    
    // Validate the user request
    const result = await tweetSchema.validate(req.body);
    if (result.error) {
      let errMsg = result.error.details[0].message;
      return res.send(utils.responseMsg(errMsg));
    } 

    const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    Tweet.create(
      { 
        userId: token.userID,
        tweet,
        like,
        date
      }, 
      (err, tweet) => {
        if (err) {
          res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
        } else {
          let message = { 
            'msg': 'Tweet Added.',
            'tweet': tweet 
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


// Fetch Tweet
router.get('/showTweet/:id', dependencies.authToken.authToken, async (req, res) => {
  try {
    console.log(req.params.id);
    Tweet.findOne(
      { _id: req.params.id },
      (err, user) => {
        if (err) {
          res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
        } else if (!user) {
          res.status(404).send(utils.responseMsg(errorMsg.noDataExist));
        } else {
          let message = { 
            'msg': `Fetch tweet succseful.`,
            'UserData': user
          };
          return res.send(utils.responseMsg(null, true, message));
        }
      });
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
});


// Update tweet
router.put('/updateTweet/:id', dependencies.authToken.authToken, async (req, res) => {
  try {
    const {
      tweet
    } = req.body;

    // Validate the user request
    const result = await tweetSchema.validate(req.body);
    if (result.error) {
      let errMsg = result.error.details[0].message;
      return res.send(utils.responseMsg(errMsg));
    } 

    const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    Tweet.findOneAndUpdate(
      {
        $and: [ 
          { _id: req.params.id }, 
          {userId: token.userID} 
        ]
      },
      { $set: 
        {
          tweet: tweet
        }
      },
      (err, updateTweet) => {
        if (err) {
          res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
        } else if (!updateTweet) {
          res.status(404).send(utils.responseMsg(errorMsg.noDataExist));
        } else {
          let message = { 
            'msg': `Tweet Updated.`
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


// Delete Tweet
router.delete('/deleteTweet/:id', dependencies.authToken.authToken, async (req, res) => {
  try {
    
    const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    Tweet.findOneAndRemove(
      {
        $and: [ 
          { _id: req.params.id }, 
          {userId: token.userID} 
        ]
      },
      (err, deleteTweet) => {
        if (err) {
          res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
        } else if (!deleteTweet) {
          res.status(404).send(utils.responseMsg(errorMsg.noDataExist));
        } else {
          let message = { 
          'msg': `Tweet Deleted.`
        };
        return res.send(utils.responseMsg(null, true, message));
        }
      })
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
});


// like tweet
router.put('/likeTweet/:id', dependencies.authToken.authToken, async (req, res) => {
  try {

    const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    Tweet.findOneAndUpdate(
      { 
        _id: req.params.id 
      },
      {
        $inc:{ like: 1 },
      },
      (err, likeTweet) => {
        if (err) {
          res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
        } else if (!likeTweet) {
          res.status(404).send(utils.responseMsg(errorMsg.noDataExist));
        } else {
          let message = { 
            'msg': `Tweet Updated.`
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


module.exports = router;
