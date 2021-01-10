const mongoose = require('mongoose');
const userSchema6 = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,

   latitude:{ type:Number,required:true },
   longitude:{ type:Number,required:true }
});

module.exports = mongoose.model('basicDetail6', userSchema6, 'basicDetails6');