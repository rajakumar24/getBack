const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const textSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
//     email: {
//     type: String,
//   },
  phone: {
    type: Number,
  },
  countryCode: {
    type: Number,
  },
  id: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Text = mongoose.model("Text", textSchema);

module.exports = Text;
