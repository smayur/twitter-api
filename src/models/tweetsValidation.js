const joi = require('@hapi/joi');

const tweetSchema = joi.object({
  userId: joi.string(),
  tweet: joi.string().min(2).max(2000).lowercase().required(),
  like: joi.number().integer().default(0),
  date: joi.date().default(Date.now)
})

module.exports = { tweetSchema };