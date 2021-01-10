// const mongoose = require('mongoose');
// const userSchema = mongoose.Schema({
//    _id: mongoose.Schema.Types.ObjectId,
//     name: { type: String, required: true },
//     email: { type: String,required:true },
//     mobile: { type: Number, required: true },
// person: { type: String, required: true },

//     rera_id: { type: String, required: true },
//     rera_url: { type: String,required: true },

// Listmy_propertyfor:{ type: String,required: true },
// Available_for:{ type: String,required: true },
// Typeof_property:{ type: String, required: true },
// Property_status:{ type: String, required: true },
// Possession_from:{ type:Date,required: true },
// Available_from:{ type:Date,required: true },
// Bachelors_allowed:{ type: String,required: true },
// Pets_allowed:{ type: String,required: true },
// Nonveg_allowed:{ type: String,required: true },
// images: {
//   type: Array,
//   default: []
// },

// });

// module.exports = mongoose.model('BasicDetail', userSchema, 'basicDetails');

const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,

  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: Number, required: true },
  person: { type: String, required: true },
  rera_id: { type: String, required: true },
  rera_url: { type: String, required: true },
  Listmy_propertyfor: { type: String, required: true },
  Available_for: { type: String, required: true },
  Typeof_property: { type: String, required: true },
  Property_status: { type: String, required: true },
  Possession_from: { type: Date, required: true },
}, { timestamps: true });


module.exports = mongoose.model('Basicdetails', userSchema, 'basicdetails')