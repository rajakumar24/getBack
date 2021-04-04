const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  apartType: {
    type: String,
    required: false,
  },
  apartName: {
    type: String,
    required: false,
  },
  bhk: {
    type: String,
    required: false,
  },
  floor: {
    type: String,
    required: false,
  },
  totalFloor: {
    type: String,
    required: false,
  },
  propertyAge: {
    type: String,
    required: false,
  },
  facing: {
    type: String,
    required: false,
  },
  nearBy1: {
    type: String,
    required: false,
  },
  nearBy2: {
    type: String,
    required: false,
  },
  nearBy3: {
    type: String,
    required: false,
  },
  locality: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 50,
  },
  landmark: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 50,
  },
  expectedPrice: {
    type: Number,
    required: false,
  },
  expectedDeposit: {
    type: Number,
    required: false,
  },
  availableFrom: {
    type: Date,
    required: false,
  },
  furnishing: {
    type: String,
    required: false,
  },
  balcony: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 100,
  },
  imgUrl: {
    type: String,
    required: false,
    default: "http://placehold.jp/300x250.png",
  },
  price: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 300,
  },
  address: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 50,
  },
  mapLocation: {
    lat: { type: String, required: false },
    lng: { type: String, required: false },
  },
  country: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  city: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  zip: {
    type: Number,
    required: false,
  },
  propertyType: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  beds: {
    type: Number,
    required: false,
  },
  baths: {
    type: Number,
    required: false,
  },
  area: {
    type: Number,
    required: false,
  },
  garages: {
    type: String,
  },
  features: {
    waterSupply: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    lift: { type: Boolean, default: false },
    clubHouse: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false },
    playArea: { type: Boolean, default: false },
    fireSafety: { type: Boolean, default: false },
    park: { type: Boolean, default: false },
    powerBackUp: { type: Boolean, default: false },
    houseKeeping: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    bar: { type: Boolean, default: false },
    internet: { type: Boolean, default: false },
    microwave: { type: Boolean, default: false },
    smoking: { type: Boolean, default: false },
    fireplace: { type: Boolean, default: false },
    toaster: { type: Boolean, default: false },
    tennis: { type: Boolean, default: false },
    tv: { type: Boolean, default: false },
  },
  approve: {
    type: String,
  },
  question: {
    type: Array,
  },
  answer: {
    type: Array,
  },
  reviewDes: {
    type: Array,
  },
  reviewTitle: {
    type: Array,
  },
  //   obej:[{
  //     answer: { type: String},
  //     question: { type: String}
  //   }
  //  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
