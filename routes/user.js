require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const keys = require("../config/keys");
const passport = require("passport");
var nodemailer = require("nodemailer");

//Load validation function
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

//Load User Model
const User = require("../models/User");
//Load Property Model
const Property = require("../models/Property");

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   //smtp.gmail.com  //in place of service use host...

//   auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD
//   },
//   secure: false,
//   tls: {
//       rejectUnauthorized: false
//   }
// });

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
// @Route api/user/otpregister

// @Route api/user/register
router.post("/register", async (req, res) => {
  const { name, email, password, password_confirmation } = req.body;
  // const countryCodeValue = `+${countryCode}`
  if (password !== password_confirmation) {
    return res.status(400).json({
      msg: "Password do not match.",
    });
  }
  //validate registration detail
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).send(errors);

  //check if user already exists

  const user = await User.findOne({ email: email });

  if (user) {
    res.status(400).send({ error: "Email already exists" });
  } else {
    const newUser = new User({
      name,
      email,
      // phone,
      // countryCodeValue,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();
    //add
    var mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Welcome",
      html:
        "<h1>Welcome To Get Right Property ! </h1><p>\
      <h3>Hello " +
        req.body.name +
        "</h3>\
      Thank You for Registering with Us. <br/>\
      Now You can visit for property and post your Property! \
      </p>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log('Email sent: ' + info.response);
        // User.updateOne({email: userData.email}, {
        //     token: currentDateTime,

        // },  {multi:true},function(err, affected, resp) {
        return res.status(200).json({
          success: false,
          msg: info.response,
          userlist: resp,
        });
        // })
      }
    });
    res.status(200).send({ msg: "registration completed please login!" });
  }
});

//@Route api/user/login
router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).send(errors);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    errors.email = "user not found";
    res.status(400).send(errors);
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // res.status(200).send("success");

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });

      res
        .status(200)
        .send({ payload: payload, success: true, token: "Bearer " + token });
    } else {
      res.status(400).send({ error: "email or password incorrect" });
    }
  }
});

//reset password
router.post("/reset", function (req, res) {
  User.findOne({ email: req.body.email }, function (error, userData) {
    //smtp.gmail.com  //in place of service use host...
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',

    //     auth: {
    //         user: process.env.EMAIL,
    //         pass: process.env.PASSWORD
    //     },
    //     secure: false,
    //     tls: {
    //         rejectUnauthorized: false
    //     }
    // host: "smtp.mailtrap.io",
    // port: 2525,
    // auth: {
    //   user: "be79cf1a9afa3d",
    //   pass: "8b674328f9118f"
    // }

    // });
    var currentDateTime = new Date();
    var mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Password Reset",
      // text: 'That was easy!',
      html:
        "<h1>Welcome To Get Right Property ! </h1><p>\
          <h3>Hello " +
        userData.name +
        "</h3>\
          If You are requested to reset your password then click on below link<br/>\
          <a href='http://ec2-13-233-172-122.ap-south-1.compute.amazonaws.com/change-password/" +
        currentDateTime +
        "+++" +
        userData.email +
        "'>Click On This Link</a>\
          </p>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        User.updateOne(
          { email: userData.email },
          {
            token: currentDateTime,
          },
          { multi: true },
          function (err, affected, resp) {
            return res.status(200).json({
              success: false,
              msg: info.response,
              userlist: resp,
            });
          }
        );
      }
    });
  });
});

//updatepassword
router.post("/updatePassword", function (req, res) {
  User.findOne({ email: req.body.email }, function (errorFind, userData) {
    if (
      userData.token == req.body.linkDate &&
      req.body.password == req.body.confirm_password
    ) {
      bcrypt.genSalt(10, (errB, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          let newPassword = hash;
          let condition = { _id: userData._id };
          let dataForUpdate = {
            password: newPassword,
            updatedDate: new Date(),
          };
          User.findOneAndUpdate(
            condition,
            dataForUpdate,
            { new: true },
            function (error, updatedUser) {
              if (error) {
                if (err.name === "MongoError" && error.code === 11000) {
                  return res
                    .status(500)
                    .json({ msg: "Mongo Db Error", error: error.message });
                } else {
                  return res
                    .status(500)
                    .json({
                      msg: "Unknown Server Error",
                      error: "Unknow server error when updating User",
                    });
                }
              } else {
                if (!updatedUser) {
                  return res.status(404).json({
                    msg: "User Not Found.",
                    success: false,
                  });
                } else {
                  return res.status(200).json({
                    success: true,
                    msg: "Your password are Successfully Updated",
                    updatedData: updatedUser,
                  });
                }
              }
            }
          );
        });
      });
    }
    if (errorFind) {
      return res.status(401).json({
        msg: "Something Went Wrong",
        success: false,
      });
    }
  });
});

//get all user properties
//@Route /api/user/property/all

router.get(
  "/property/all",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize;

    const propertyList = await Property.find({
      user: mongoose.Types.ObjectId(req.user.id),
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize * 1)
      .sort({ date: -1 })
      .populate("user", ["-password"]);

    console.log("total couunt:", propertyList.length);

    if (propertyList.length > 0) {
      res.status(200).send(propertyList);
    } else {
      res.status(400).send({ msg: "no property found" });
    }
  }
);

//get user property count
//@Route /api/user/propertyCount
router.get(
  "/propertyCount",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const totalCount = await Property.find({
      user: mongoose.Types.ObjectId(req.user.id),
    }).countDocuments();

    if (totalCount === 0) {
      res.status(400).send({ err: "1no property found" });
    } else {
      res.status(200).send({ totalCount: totalCount });
    }
  }
);

//get user properties list with user id to count total properties
//@Route /api/user/property/:id
router.get("/property/:id", async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const propertyList = await Property.find({
      user: mongoose.Types.ObjectId(req.params.id),
    });
    if (propertyList) {
      res.status(200).send(propertyList);
    } else {
      res.status(400).send("not found");
    }
  } else {
    res.status(400).send({ err: "not found" });
  }
});

module.exports = router;
