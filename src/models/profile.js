const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: String,
  displayName: String,
  gender: String,
  age: Number,
  mobile_number: Number
})


const Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;