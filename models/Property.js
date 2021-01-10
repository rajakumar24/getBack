const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 30
  },
  imgUrl: {
    type: String,
    required: false,
    default: "http://placehold.jp/300x250.png"
  },
  price: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false,
    minlength: 15,
    maxlength: 300
  },
  address: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 50
  },
  mapLocation: {
    lat: { type: String, required: false },
    lng: { type: String, required: false }
  },
  country: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30
  },
  city: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30
  },
  zip: {
    type: Number,
    required: false
  },
  propertyType: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  beds: {
    type: Number,
    required: false
  },
  baths: {
    type: Number,
    required: false
  },
  area: {
    type: Number,
    required: false
  },
  garages: {
    type: Number
  },
  features: {
    ac: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    bar: { type: Boolean, default: false },
    internet: { type: Boolean, default: false },
    microwave: { type: Boolean, default: false },
    smoking: { type: Boolean, default: false },
    fireplace: { type: Boolean, default: false },
    toaster: { type: Boolean, default: false },
    tennis: { type: Boolean, default: false },
    tv: { type: Boolean, default: false }
  },
  approve: {
    type: String
  },
  question: {
    type: Array
  },
  answer: {
    type: Array
  },
  reviewDes: {
    type: Array
  },
  reviewTitle: {
    type: Array
  },
//   obej:[{
//     answer: { type: String},
//     question: { type: String}
//   }
//  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
