const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // phone: {
  //   type: Number,
  //   required: true,
  // },
  // countryCode: {
  //   type: Number,
  // },
  // id: {
  //   type: Number,
  // },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100
  },
  // date: {
  //   type: Date,
  //   default: Date.now
  // }
  status: {
    type: Boolean,
    default: 1
  },
  token: {
    type: String,
    default: ''
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: null
  },
  deletedDate: {
    type: Date,
    default: null
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
