const joi = require('@hapi/joi');

const profileSchema = joi.object({
  userId: joi.string(),
  name: joi.string().max(50).lowercase().required(),
  displayName: joi.string().max(50).required(),
  gender: joi.string().valid('male', 'female', 'other').required(),
  age: joi.number().integer().required(),
  mobile_number: joi.number().integer().min(100000000).message("invalid mobile number").max(9999999999).message("invalid mobile number").required(),
})

module.exports = { profileSchema };