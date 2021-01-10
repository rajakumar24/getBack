const mongoose = require('mongoose');
const userSchema2 = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,

       city:{ type: String, required: true },
     state:{type: String, required: true},
     zip:{type:Number, required: true},
     Building_area:{ type: String, required: true },

});

module.exports = mongoose.model('basicDetail2', userSchema2, 'basicDetails2');