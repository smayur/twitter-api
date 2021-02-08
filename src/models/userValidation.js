const joi = require('@hapi/joi');

const userSchema = joi.object({
  username: joi.string().email().lowercase().required(),
  password: joi.string().min(6).required()
})

module.exports = { userSchema };