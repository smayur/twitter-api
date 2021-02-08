const router = require('express').Router();

const dependencies = require('./routesDependencies').default;

router.post('/profile', dependencies.authToken.authToken, (req, res) => {
  res.send('please add your profile');
});

module.exports = router;
