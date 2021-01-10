const mongoose = require('mongoose');
const userSchema1 = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,

   premiumName:{ type:String,required:true }

});

module.exports = mongoose.model('basicDetail1', userSchema1, 'basicDetails1');