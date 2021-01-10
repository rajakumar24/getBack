const mongoose = require('mongoose');
const userSchema3 = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,

    Bhk:{ type: String, required: true },
     Carpet_Area:{ type: Number, required: true },
     BuiltUp_Area:{ type: Number, required: true },
     Sale_price:{ type:Number, required: true },
     Price_negotiable:{ type:Boolean, required: true },
     Include_registration:{type:Boolean, required: true },
    Bathrooms:{ type:Number, required: true },
    Frunish_status:{ type: String, required: true },
    Reserved_parking:{ type: String, required: true },
    total_floors:{ type:Number, required: true },
    property_on_floor:{ type: Number, required: true },
    Balconices:{ type: Number, required: true },
    Description:{ type: String, required: true },

});

module.exports = mongoose.model('basicDetail3', userSchema3, 'basicDetails3');