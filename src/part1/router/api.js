const express = require('express');
const router = express.Router();
 const User = require('../models/user');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const path = require('path');
const mongoose = require('mongoose');
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');

const transporter=nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:'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'
  }
}));


// mongoose.Promise = global.Promise;





router.post('/register',async (req, res, next) => {
  User.find({email: req.body.email})
  // User.find({username: req.body.username})
    .exec()
    .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Mail exists"
          });
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  return res.status(500).json({
                    error: err
                  });
                }
                else
                {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username:req.body.username,
                        email: req.body.email,
                        phonenumber:req.body.phonenumber,
                        password: hash,
                        person:req.body.person,
                        // firstName:req.body.firstName,
                        // lastName:req.body.lastName,
                        // username:req.body.username,
                        // password: hash,
                      });
                      user
                        .save()
                        .then(result => {
                        /*transporter.sendMail({
                            to:req.body.email,
                            from:'sagar2020pani@gmail.com',
                            subject:'signup succeded!',
                            html:'<h1>You successfully signed up!</h1>'

                          });*/
                          console.log(result);
                          let payload = {subject: result._id}
                          let token = jwt.sign(payload, 'secretKey')
                          return res.status(201).json({
                            message: "User created",
                            token:token

                          });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                              error: err
                            });
                          });
                }

            });
        }
    }).catch(err=>{
      console.log(err);
    })
});


router.post('/login',(req, res, next) => {
User.find({ email: req.body.email })
// User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "username failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if(result) {
            let payload = {subject:result._id}
            let token = jwt.sign(payload, 'secretKey')
            return res.status(201).json({
                message: "Auth successful",
                token: token,
              });
          
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});



router.get('/profile',(req, res, next) => {
  //User.find({ email: req.body.email })
  User.find({ username: req.body.username })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "username failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if(result) {
              let payload = {subject:result._id}
              let token = jwt.sign(payload, 'secretKey')
              return res.status(201).json({
                  message: "Auth successful",
                  token: token,
                });
            
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });



router.delete('/:userId',(req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });





  router.put('/reset-password',(req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "email failed"
        });
      }
          else{
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                  if (err) {
                    return res.status(500).json({
                      error: err
                    });
                  }
                  else
                  {
                    User.update({email:req.body.email}, { $set:{password:hash}})
                          .exec()
                          .then(result => {
                          /*transporter.sendMail({
                              to:req.body.email,
                              from:'sagar2020pani@gmail.com',
                              subject:'signup succeded!',
                              html:'<h1>You successfully signed up!</h1>'
  
                            });*/
                            console.log(result);
                            let payload = {subject: result._id}
                            let token = jwt.sign(payload, 'secretKey')
                            return res.status(201).json({
                              message: "User created",
                              token:token
  
                            });
                          })
                          .catch(err => {
                              console.log(err);
                              res.status(500).json({
                                error: err
                              });
                            });
                  }
  
              });
          }
      }).catch(err=>{
        console.log(err);
      })
  });

  



module.exports = router;


