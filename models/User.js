const { Schema, model } = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  hashedPassword: String
});

const User = model("User", userSchema);
userSchema.plugin(uniqueValidator);
module.exports = User;
