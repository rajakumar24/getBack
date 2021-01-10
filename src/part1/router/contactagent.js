const express = require('express');
const router = express.Router();
const Contactagent=require('../models/contactagent');
const Basicdetails=require('../models/Basicdetails')
const user = require('../models/user');
const mongoose = require('mongoose');


router.post('/contactedagent',(req, res, next) => {
    Basicdetails.findById(req.body.houseowner)
      .then(personId => {
        if (!personId) {
          return res.status(404).json({
            message: "uploaded builder is not found"
          });
        }
        const person = new Contactagent({
          _id: mongoose.Types.ObjectId(),
          name: req.body.name,
          houseowner: req.body.houseowner,
          email:req.body.email,
          phonenumber:req.body.phonenumber,
        });
        return person.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "contacted successfully",
          contactedPerson_Details: {
            _id: result._id,
            name: result.name,
            houseowner: result.houseowner,
            email: result.email,
            phonenumber: result.phonenumber
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/contactedagent/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  

  


module.exports = router;