const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tweet: String,
  like: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
})


const Tweet = mongoose.model('tweet', tweetSchema);

module.exports = Tweet;